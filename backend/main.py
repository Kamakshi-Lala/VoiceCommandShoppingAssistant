from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DB_URL = "postgresql://my_db_u4up_user:XGyh0GORZaEjNDblJ5f9slLHlm103WFJ@dpg-d2q5lth5pdvs73dl9a60-a:5432/my_db_u4up"
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

app = FastAPI()

class ItemDB(Base):
    __tablename__ = "shopping_items"
    id = Column(Integer, primary_key=True, index=True)
    item = Column(String, index=True)
    quantity = Column(Integer)
    category = Column(String)

Base.metadata.create_all(bind=engine)

class Item(BaseModel):
    item: str
    quantity: int = 1
    category: str = "general"

@app.post("/add/")
def add_item(item: Item):
    db = SessionLocal()
    new_item = ItemDB(item=item.item, quantity=item.quantity, category=item.category)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    db.close()
    return {"message": f"{item.quantity} {item.item}(s) added."}

@app.get("/list/")
def list_items():
    db = SessionLocal()
    items = db.query(ItemDB).all()
    db.close()
    return items

@app.delete("/remove/{item_name}")
def remove_item(item_name: str):
    db = SessionLocal()
    item = db.query(ItemDB).filter(ItemDB.item == item_name).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    db.close()
    return {"message": f"{item_name} removed."}