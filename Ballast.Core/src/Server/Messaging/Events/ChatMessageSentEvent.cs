using Ballast.Core.ValueObjects;

namespace Ballast.Core.Messaging.Events
{
    public class ChatMessageSentEvent : EventBase 
    {

        public ChatMessage Message { get; set; }

        public override string Id => nameof(ChatMessageSentEvent);

    }
}