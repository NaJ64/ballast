using System;

namespace Ballast.Core.ValueObjects
{
    public class ChatMessage
    {
        public string From { get; set; }
        public string Channel { get; set; }
        public string Text { get; set; }
        public string TimestampText { get; set; }
    }
}