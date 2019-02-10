using System;

namespace Ballast.Core.Utilities 
{
    public static class DateExtensions
    {
        public static string ToIsoString(this DateTime dateTime)
        {
            return dateTime.ToString("s", System.Globalization.CultureInfo.InvariantCulture);
        }
        public static string ToIsoString(this DateTime? dateTime)
        {
            if (dateTime == null)
                return null;
            return dateTime.Value.ToIsoString();
        }
    }
}