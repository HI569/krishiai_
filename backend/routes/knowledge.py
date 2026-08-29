from fastapi import APIRouter
router=APIRouter()
ARTICLES=[{'category':'Crops','title':'Choosing a crop for your soil','text':'Understand how pH, nutrients, rainfall and season influence crop choice.'},{'category':'Soil','title':'Reading NPK values','text':'A simple guide to nitrogen, phosphorus and potassium in your soil report.'},{'category':'Irrigation','title':'When should I irrigate?','text':'Use crop stage, soil moisture and weather together instead of a fixed schedule.'}]
@router.get('/crops')
def crops():return ARTICLES
@router.get('/diseases')
def diseases():return []
@router.get('/knowledge')
def knowledge(q:str|None=None):return [a for a in ARTICLES if not q or q.lower() in (a['title']+a['text']).lower()]
