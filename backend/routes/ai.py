from fastapi import APIRouter
from pydantic import BaseModel
from rag.graph import answer_question
router=APIRouter()
class Chat(BaseModel):message:str;language:str='English';history:list[dict]=[]
@router.post('/chat')
def chat(x:Chat): return {'answer':answer_question(x.message,x.language,x.history),'grounded':True,'sources':['KrishiAI agricultural knowledge base']}
@router.post('/voice')
def voice(): return {'status':'Use browser speech recognition or connect a speech-to-text provider.'}
