from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ ="users"
    u_id = Column(String, primary_key=True)
    name = Column(String)
    password = Column(String)


#u_id_1의 친구 관계인 u_id_2
class Friend(Base):
    __tablename__ ="friends"
    f_id = Column(Integer, primary_key=True)
    u_id_1 = Column(String, ForeignKey("users.u_id",ondelete="CASCADE"))
    u_id_2 = Column(String, ForeignKey("users.u_id",ondelete="CASCADE"))



class Chatroom(Base):
    __tablename__ ="chatrooms"
    chrm_id = Column(Integer, primary_key=True)
    u_ids = Column(String)
    
class Chat(Base):
    __tablename__ ="chats"
    c_id = Column(Integer, primary_key=True)
    chrm_id = Column(Integer, ForeignKey("chatrooms.chrm_id"))
    sender = Column(String)
    msg = Column(String)
    time = Column(Integer)
