from typing import Annotated
from fastapi import Depends, APIRouter
from ..service.joke import JokeService
from .. import schemas
from ..infrastructure.http.client import ExternalApiClient
from ..schemas import Joke

router = APIRouter(prefix="/external", tags=["Users"])
# http client that implement the contract defined by HttpCLient
http_client = ExternalApiClient(base_url="https://api.chucknorris.io/jokes/random")

@router.get("/joke", response_model=schemas.Joke)
# dependency injection of the JokeService
async def get_random_joke(service: Annotated[JokeService, Depends(lambda: JokeService(http_client))]):
    return await service.get_joke()

