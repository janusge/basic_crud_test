from fastapi import HTTPException
import httpx
import logging

logging.basicConfig(
    level=logging.INFO, format="%(levelname)s: \t %(message)s -  %(asctime)s - %(name)s"
)

logger = logging.getLogger(__name__)


class HttpCLient:
    def __init__(self, base_url: str):
        self.base_url = base_url

    def get(self, params: dict = None):
        pass


class ExternalApiClient(HttpCLient):
    def __init__(self, base_url: str):
        super().__init__(base_url)

    async def get(self, params: dict = None):
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(self.base_url, params=params)
                response.raise_for_status()

                logger.info(
                    "status code: %s, response: %s", response.status_code, response.text
                )

                return response

            except httpx.HTTPStatusError as e:
                logger.error(
                    "status code: %s, response: %s",
                    e.response.status_code,
                    e.response.text,
                )
                raise HTTPException(
                    status_code=e.response.status_code, detail="External API error"
                )

            except httpx.RequestError as e:
                logger.error(
                    "status code: %s, response: %s",
                    e.response.status_code,
                    e.response.text,
                )
                raise HTTPException(
                    status_code=500, detail="Request failed to external API"
                )
