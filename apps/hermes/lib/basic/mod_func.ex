defmodule Basic.Zero do
  @moduledoc """
  Zero check.
  """
  def zero?(0), do: true
  def zero?(+0.0), do: true
  def zero?(-0.0), do: true
  def zero?(x) when is_integer(x), do: false
  def zero?(x) when is_float(x), do: false
end

defmodule Basic.Concat do
  @moduledoc """
  Concat.
  """
  def join(a) do
    a
  end

  def join(a, b, sep \\ " ") do
    a <> sep <> b
  end
end
