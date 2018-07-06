using Ballast.Core.ValueObjects;
using System;

namespace Ballast.Core.ValueObjects
{
    public class ChatMessage
    {
        public Guid? GameId { get; set; }
        public Guid FromPlayerId { get; set; }
        public string FromPlayerName { get; set; }
        public string Channel { get; set; }
        public string Text { get; set; }
        public string TimestampText { get; set; }
    }
}