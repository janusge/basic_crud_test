from fastapi import HTTPException, status
from .. import schemas
from ..infrastructure.http.client import ExternalApiClient, HttpCLient
from ..schemas import Joke
import logging

logging.basicConfig(
    level=logging.INFO, format="%(levelname)s: \t %(message)s -  %(asctime)s - %(name)s"
)

logger = logging.getLogger(__name__)


class JokeService:
    def __init__(self, http_client: HttpCLient):
        self.http_client = http_client

    async def get_joke(self) -> Joke:
        try:
            response = await self.http_client.get()

            logger.info(
                "status code: %s, response: %s", response.status_code, response.text
            )

            if response.status_code == 200:
                joke_data = response.json()

                return Joke(value=joke_data["value"])

            else:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Service unavailable. Please try again later.",
                )
        except Exception as error:
            logger.error("Error fetching joke: %s", str(error))

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Service unavailable. Please try again later.",
            )
