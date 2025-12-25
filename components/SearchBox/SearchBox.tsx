import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => (
  <input
    className={css.input}
    type="text"
    placeholder="Search notes"
    value={value}
    onChange={e => onChange(e.target.value)}
  />
);

export default SearchBox;
