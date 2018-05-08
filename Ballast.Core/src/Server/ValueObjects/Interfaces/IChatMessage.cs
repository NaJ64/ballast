using System;

namespace Ballast.Core.ValueObjects
{
    public interface IChatMessage
    {
        Guid? GameId { get; }
        string From { get; }
        string Channel { get;  }
        string Text { get;  }
        string TimestampText { get; }
    }
}