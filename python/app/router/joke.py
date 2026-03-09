from typing import Annotated
from fastapi import Depends, APIRouter
from ..application.joke import JokeService
from ..infrastructure.http.client import ExternalApiClient
from ..schemas import Joke

router = APIRouter(prefix="/external", tags=["Users"])

http_client = ExternalApiClient(base_url="https://api.chucknorris.io/jokes/random")


@router.get(
    "/joke",
    response_model=Joke,
    summary="Get a random joke and return it to the user",
)
async def get_random_joke(
    service: Annotated[JokeService, Depends(lambda: JokeService(http_client))],
):
    return await service.get_joke()
