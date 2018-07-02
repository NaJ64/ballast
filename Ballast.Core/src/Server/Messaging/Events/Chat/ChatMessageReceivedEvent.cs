using Ballast.Core.ValueObjects;

namespace Ballast.Core.Messaging.Events.Game
{
    public class ChatMessageReceivedEvent : EventBase 
    {

        public ChatMessage Message { get; set; }

        public override string Id => nameof(ChatMessageReceivedEvent);

    }
}