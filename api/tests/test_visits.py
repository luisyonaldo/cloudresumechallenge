import json
import unittest
from unittest.mock import patch

from app.visits import handler


class TestLamnda(unittest.TestCase):
    VISITS = 0

    @patch("app.visits.increase")
    def test_handler(self, mock):
        mock.return_value = self.VISITS
        expected = {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"visits": self.VISITS}),
        }
        actual = handler({}, {})
        self.assertEqual(actual, expected)


if __name__ == "__main__":
    unittest.main()
