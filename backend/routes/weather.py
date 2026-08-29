from fastapi import APIRouter
router=APIRouter()
@router.get('/weather')
def weather(lat:float,lon:float): return {'lat':lat,'lon':lon,'temperature':28,'humidity':68,'rainfall':12,'source':'demo weather adapter'}
@router.get('/location')
def location(): return {'location':'Punjab, India','lat':30.901,'lon':75.8573}
