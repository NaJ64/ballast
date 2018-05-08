namespace Ballast.Core.Models
{
    public abstract class StaticListTypeBase<TSelf> : IStaticListType where TSelf : StaticListTypeBase<TSelf>
    {
        
        public int Value { get; protected set; }
        public string Name { get; protected set; }

        protected StaticListTypeBase() { }  // Default paremeter-less constructor for model-binding
        protected StaticListTypeBase(int value, string name) {
            Value = value;
            Name = name;
        }

        public virtual bool Equals(TSelf staticListType) 
        {
            if (staticListType == null)
                return false;
            return this.Value == staticListType.Value;
        }
        
    }
}