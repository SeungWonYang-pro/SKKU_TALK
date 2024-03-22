from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserSchema(BaseModel):
    u_id: str
    name: str
    password: str 
    
    class Config:
        orm_mode = True


class LoginSchema(BaseModel):
    u_id: str
    password: str 
    class Config:
        orm_mode = True

class getUserSchema(BaseModel):
    u_id: str

class addFriendSchema(BaseModel):
    u_id_1: str
    u_id_2: str
    


class FriendSchema(BaseModel):
    f_id: int
    u_id_1: str
    u_id_2: str
    class Config:
        orm_mode = True

class ChatroomSchema(BaseModel):
    chrm_id: int
    u_ids:str

class getChatroomSchema(BaseModel):
    u_id1: str
    u_id2: str    
    
class getChatRoomListSchema(BaseModel):
    u_ids:str
class createChatroomSchema(BaseModel):
    u_ids:str
    
class ChatSchema(BaseModel):
    c_id : int 
    chrm_id : int     
    sender: str 
    msg : str 
    time : int 

class getChatSchema(BaseModel):
    chrm_id: int
    
    

class addChatSchema(BaseModel):
    chrm_id: int
    sender : str
    msg : str
    time : int