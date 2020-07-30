import json
import unittest
from dataclasses import dataclass
from unittest.mock import patch

from app.visits import handler, increase


@dataclass
class Context:
    """Class for keeping track of an item in inventory."""
    function_name: str = ""
    memory_limit_in_mb: str = ""
    invoked_function_arn: str = ""
    aws_request_id: str = ""

class TestLamnda(unittest.TestCase):
    VISITS = 0
    CONTEXT = Context()

    @patch("app.visits.increase")
    def test_handler(self, mock):
        mock.return_value = self.VISITS
        expected = {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"visits": self.VISITS}),
        }
        actual = handler({}, self.CONTEXT)
        self.assertEqual(actual, expected)

    def test_increase(self):
        expected = 4
        actual = 0
        for _ in range(expected):
            actual = increase()

        self.assertEquals(actual, expected)


if __name__ == "__main__":
    unittest.main()
