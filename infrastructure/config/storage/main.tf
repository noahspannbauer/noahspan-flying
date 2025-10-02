locals {
  account_name = {
    test = "noahspanflyingtest"
    prod = "noahspanflyingprod"
  }

  containers = {
    test = ["tracks"]
    prod = ["tracks"]
  }

  shares = {
    test = ["flying-test-files"]
    prod = ["flying-prod-files"]
  }

  tables = {
    test = ["logs", "pilots"]
    prod = ["logs", "pilots"]
  }
}