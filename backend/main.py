from fastapi import HTMLResponse,FastAPI, HTTPException, Body
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

@app.get("/")
def root():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Shopping Assistant</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f4f6f9;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
            }
            h1 { color: #2c3e50; }
            p  { color: #34495e; font-size: 18px; }
            a {
                color: #3498db;
                text-decoration: none;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <h1>Shopping Assistant API</h1>
        <p>Welcome! This is the backend service.</p>
        <p> View your shopping list: <a href="/list/">/list/</a></p>
    </body>
    </html>
    """
    


@app.post("/add/")
def add_item(item: Item):
    db = SessionLocal()
    new_item = ItemDB(item=item.item, quantity=item.quantity, category=item.category)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    db.close()
    return {
        "status": "success",
        "action": "add",
        "item": item.item,
        "quantity": item.quantity,
        "message": f"{item.quantity} {item.item}(s) added."
    }


@app.get("/list/")
def list_items():
    db = SessionLocal()
    items = db.query(ItemDB).all()
    db.close()
    return [
        {"id": i.id, "item": i.item, "quantity": i.quantity, "category": i.category}
        for i in items
    ]


@app.post("/parse_command/")
def parse_command(data: dict = Body(...)):
    text = data["text"].lower()
    db = SessionLocal()

    if "add" in text:
        parts = text.split()
        quantity = 1
        for word in parts:
            if word.isdigit():
                quantity = int(word)
        item = parts[-1]
        new_item = ItemDB(item=item, quantity=quantity, category="general")
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        db.close()
        return {
            "status": "success",
            "action": "add",
            "item": item,
            "quantity": quantity,
            "message": f"Added {quantity} {item}(s)."
        }

    elif "remove" in text:
        item = text.split()[-1]
        item_db = db.query(ItemDB).filter(ItemDB.item == item).first()
        if item_db:
            db.delete(item_db)
            db.commit()
            db.close()
            return {
                "status": "success",
                "action": "remove",
                "item": item,
                "message": f"Removed {item}."
            }
        else:
            db.close()
            return {
                "status": "error",
                "action": "remove",
                "item": item,
                "message": f"Item {item} not found."
            }
    
    db.close()
    return {
        "status": "error",
        "action": "unknown",
        "message": "Command not understood."
    }
