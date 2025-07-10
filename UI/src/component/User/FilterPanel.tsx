import React,{useState} from 'react';

interface FilterPanelProps {
    categories: string[];
}


const FilterPanel: React.FC<FilterPanelProps> = ({ categories }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div>
      <h5 className="mb-3 d-flex align-items-center position-sticky">
        Filters
        <button
          className="btn btn-sm btn-outline-primary d-md-none ml-3"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "Show" : "Hide"}
        </button>
      </h5>

      <div 
        className={`${collapsed ? "d-none" : "d-block"} d-md-block`}
      >
        <div className="mb-3">
          <h6 className="mb-3 sm-col-3">Categories</h6>
          {categories.map((cat) => (
            <div key={cat} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                // onChange={() => handleChange(cat)}
                // checked={selectedCategories.includes(cat)}
              />
              <label className="form-check-label">{cat}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FilterPanel;