using System.Collections.Generic;
using System.Linq;

namespace SpigotWrapper.Extensions;

public static class EnumerableExtensions
{
    public static bool IsNullOrEmpty<T>(this IEnumerable<T> enumerable)
        => enumerable == null || !enumerable.Any();
}