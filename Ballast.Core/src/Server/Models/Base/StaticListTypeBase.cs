using Ballast.Core.Models.Interfaces;

namespace Ballast.Core.Models
{
    public abstract class StaticListTypeBase : IStaticListType
    {
        public int Value { get; protected set; }
        public string Name { get; protected set; }
        protected StaticListTypeBase(int value, string name) {
            Value = value;
            Name = name;
        }
    }
}