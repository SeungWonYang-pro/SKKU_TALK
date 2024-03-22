from fastapi import FastAPI, Depends, Request, Response, WebSocket
from fastapi.staticfiles import StaticFiles 
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.templating import Jinja2Templates

from fastapi.security import OAuth2PasswordRequestForm

from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException

from typing import List
from pydantic import BaseModel
from sqlalchemy.orm import Session

from models import Base, User
from crud import db_register_user, get_friends, add_friend, get_New_friends, create_chatroom, get_chatroom, add_chat
from crud import get_chatlist,get_chatroomList
from database import SessionLocal, engine
from schema import UserSchema, LoginSchema, getUserSchema, FriendSchema, addFriendSchema, ChatroomSchema, createChatroomSchema, getChatroomSchema
from schema import addChatSchema, ChatSchema, getChatSchema ,getChatRoomListSchema
Base.metadata.create_all(bind=engine)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()


templates = Jinja2Templates(directory="templates")

class NotAuthenticatedException(Exception):
    pass


SECRET = "super-secret-key"
manager = LoginManager(SECRET, '/login', use_cookie=True, custom_exception=NotAuthenticatedException)

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

@manager.user_loader
def get_user(u_id:str, db:Session =None):
    if not db:
        with SessionLocal() as db:
            return db.query(User).filter(User.u_id==u_id).first()
    return db.query(User).filter(User.u_id==u_id).first() 



@app.exception_handler(NotAuthenticatedException)
def auth_exception_handler(request:Request, exc: NotAuthenticatedException):
    return templates.TemplateResponse("login.html")


@app.post('/register')
def register_user(response: Response, data: UserSchema , db :Session = Depends(get_db)):
    u_id = data.u_id
    username = data.name
    password = data.password
    
    user = db_register_user(db, u_id, username, password)
    if user:
        access_token = manager.create_access_token(
             data= {'sub':username}
        )
        manager.set_cookie(response, access_token)
        return "User created"
    else:
        return "Failed"



@app.post('/token')
def login(response: Response, data: LoginSchema):
    u_id= data.u_id
    password= data.password
    
    user = get_user(u_id)

    if not user:
        raise InvalidCredentialsException
    if user.password != password:
        raise InvalidCredentialsException
    access_token  = manager.create_access_token(
        data = {'sub': user.name}
    )
    
    manager.set_cookie(response, access_token)
    
    return {'access_token': access_token}



@app.post("/username",response_model=UserSchema)
def get_user_name(data:getUserSchema):
    u_id= data.u_id
    return get_user(u_id)

@app.post("/getFriends",response_model=List[FriendSchema])
def get_friendlist(data:getUserSchema, db :Session = Depends(get_db)):
    u_id= data.u_id
    return get_friends(db, u_id)

@app.post("/addFriend", response_model=FriendSchema)
def add_newfriend(data: addFriendSchema, db :Session = Depends(get_db)):
    u_id_1= data.u_id_1
    u_id_2= data.u_id_2
    return add_friend(db, u_id_1, u_id_2)


@app.post("/getNewFriends",response_model=List[UserSchema])
def get_friendlist(data:getUserSchema, db :Session = Depends(get_db)):
    u_id = data.u_id
    return get_New_friends(db, u_id)            

@app.post("/createChatroom", response_model=ChatroomSchema)
def create_new_chatroom(data: createChatroomSchema, db :Session = Depends(get_db)):
    u_ids = data.u_ids
    return create_chatroom(db, u_ids)


@app.post("/getChatroom", response_model=ChatroomSchema)
def get_croom(data: getChatroomSchema, db :Session = Depends(get_db)):
    u_id1 = data.u_id1
    u_id2 = data.u_id2    
    return get_chatroom(db, u_id1,u_id2)

@app.post("/getchatroomlist",response_model= List[ChatroomSchema])
def get_chroomlist(data: getChatRoomListSchema,db:Session =Depends(get_db)):
    u_ids= data.u_ids
    return get_chatroomList(db, u_ids)

@app.post("/postmsg", response_model= ChatSchema)
def addChat(data: addChatSchema,  db :Session = Depends(get_db)):
    chrm_id=data.chrm_id
    sender = data.sender
    msg = data.msg
    time = data.time
    return add_chat(db,chrm_id,sender,msg,time)

@app.post("/getmsglist", response_model= List[ChatSchema])
def getChat(data: getChatSchema,  db :Session = Depends(get_db)):
    chrm_id=data.chrm_id
    return get_chatlist(db,chrm_id)

@app.get("/")
def get_root(request: Request):
    return templates.TemplateResponse("login.html",{"request":request})

@app.get("/mainpage")
def get_main(request: Request):
    return templates.TemplateResponse("mainpage.html",{"request":request})

@app.get("/signup")
def signup(request: Request):
    return templates.TemplateResponse("signup.html",{"request":request})
@app.get("/newFriend")
def newF(request: Request):
    return templates.TemplateResponse("newfriend.html",{"request":request})

@app.get("/chatroom")
def chroom(request: Request):
    return templates.TemplateResponse("chatroom.html",{"request":request})
@app.get("/chatrooms")
def chroom(request: Request):
    return templates.TemplateResponse("chatrooms.html",{"request":request})
@app.get("/makegroup")
def grch(request: Request):
    return templates.TemplateResponse("makegroup.html",{"request":request})
class ConnectionManager:
    def __init__(self):
        self.active_connections = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)
        

wsmanager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await wsmanager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await wsmanager.broadcast(f"{data}")
    except Exception as e:
        pass
    finally:
        await wsmanager.disconnect(websocket)
        
        
def run():
    import uvicorn
    uvicorn.run(app)

if __name__ == "__main__":
    run()
    