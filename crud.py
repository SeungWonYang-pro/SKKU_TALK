from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from models import User, Friend, Chatroom, Chat

#회원가입 유저 등록
def db_register_user(db:Session, u_id, name , password):
    db_item = User(u_id=u_id,name=name, password=password)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


#u_id로 name 검색
def get_username(db:Session, u_id):
    return db.query(User).filter(User.u_id==u_id).first()

#u_id로 친구관계 검색
def get_friends(db:Session, u_id):
    return db.query(Friend).filter(Friend.u_id_1==u_id)

#친구 후보 검색
def get_New_friends(db:Session, u_id):
    fr = db.query(Friend).filter(Friend.u_id_1==u_id)   # 현재 친구 리스트
    us = db.query(User).filter(User.u_id!= u_id)    # 현재 
    ret = []
    for u_item in us:
        no_friend = True
        for f_i in fr:
            if(u_item.u_id == f_i.u_id_2):
                no_friend=False
                break
        if(no_friend):
            ret.append(u_item)
    return ret
#친구 추가    
def add_friend(db:Session, u_id_1, u_id_2):
    db_item = Friend(u_id_1=u_id_1,u_id_2=u_id_2)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# 채팅방 만들기
def create_chatroom(db:Session, u_ids):
    db_item = Chatroom(u_ids=u_ids)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# 채팅방 조회
def get_chatroom(db:Session, u_id1, u_id2):
    return db.query(Chatroom).filter( (Chatroom.u_ids==u_id1) | (Chatroom.u_ids==u_id2)).first()
# 채팅방리스트 조회
def get_chatroomList(db:Session, u_ids):
    return db.query(Chatroom).filter( Chatroom.u_ids.like('%'+u_ids+'%'))

# 채팅 리스트 조회
def get_chatlist(db:Session, chrm_id):
    print(chrm_id)
    return db.query(Chat).filter(Chat.chrm_id==chrm_id)

# 채팅 추가
def add_chat(db:Session, chrm_id,sender,msg,time):
    db_item = Chat(chrm_id=chrm_id, sender=sender, msg=msg,time=time)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item