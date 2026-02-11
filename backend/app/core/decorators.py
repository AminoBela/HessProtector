import logging
import time
from functools import wraps
from typing import Callable

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def cached(ttl_seconds: int = 300):
    cache = {}

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{args}:{kwargs}"

            if key in cache:
                result, timestamp = cache[key]
                if time.time() - timestamp < ttl_seconds:
                    logger.info(f"[CACHE HIT] {func.__name__}")
                    return result

            result = func(*args, **kwargs)
            cache[key] = (result, time.time())
            logger.info(f"[CACHE MISS] {func.__name__}")
            return result

        return wrapper

    return decorator


def logged(func: Callable) -> Callable:
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger.info(
            f"[LOG] Calling {func.__name__} with args={args[:2]}..."
            if args
            else f"[LOG] Calling {func.__name__}"
        )
        try:
            result = func(*args, **kwargs)
            logger.info(f"[LOG] {func.__name__} completed successfully")
            return result
        except Exception as e:
            logger.error(f"[LOG] {func.__name__} failed with error: {e}")
            raise

    return wrapper


def timed(func: Callable) -> Callable:
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start_time
        logger.info(f"[TIMER] {func.__name__} took {elapsed:.4f}s")
        return result

    return wrapper


def retry(max_attempts: int = 3, delay: float = 1.0):
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            current_delay = delay

            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_attempts - 1:
                        logger.warning(
                            f"[RETRY] {func.__name__} attempt {attempt + 1} failed, retrying in {current_delay}s..."
                        )
                        time.sleep(current_delay)
                        current_delay *= 2

            logger.error(
                f"[RETRY] {func.__name__} failed after {max_attempts} attempts"
            )
            raise last_exception

        return wrapper

    return decorator
