from redis import Redis
from rq import Queue

from app.core.config import settings

redis_client: Redis = Redis.from_url(settings.REDIS_URL)  # type: ignore


email_queue = Queue("email", connection=redis_client)

QUEUE = {
    "email": email_queue,
}


def get_redis() -> Redis:
    return redis_client
