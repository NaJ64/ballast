namespace Ballast.Core.ValueObjects
{
    public interface IChatMessage
    {
        string From { get; }
        string Channel { get;  }
        string Text { get;  }
        string TimestampText { get; }
    }
}