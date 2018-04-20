using System;

namespace Ballast.Core.Chat 
{
    public class ChatMessage
    {
        public string From { get; set; }
        public string Channel { get; set; }
        public string Text { get; set; }
        public DateTime Timestamp { get; set; }
    }
}