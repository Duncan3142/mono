defmodule Basic.EnumstreamTest do
  use ExUnit.Case, async: true

  test "stream" do
    assert Basic.Enumstream.stream() == [
             "defmodule Basic.Enumstream do\n",
             "  @moduledoc \"\"\"\n"
           ]
  end
end
