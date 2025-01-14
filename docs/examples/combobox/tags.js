// @flow strict
import { useState, useRef, type Node } from 'react';
import { Box, ComboBox, Flex, Tag } from 'gestalt';

export default function Example(): Node {
  const ref = useRef();
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const PRONOUNS = [
    'ey / em',
    'he / him',
    'ne / nem',
    'she / her',
    'they / them',
    've / ver',
    'xe / xem',
    'xie / xem',
    'zie / zem',
  ];

  const options = PRONOUNS.map((pronoun, index) => ({ label: pronoun, value: `value${index}` }));

  const [suggestedOptions, setSuggestedOptions] = useState(
    options.filter((pronoun) => !selected.includes(pronoun.value)),
  );

  const handleOnSelect = ({ item: { label } }) => {
    if (!selected.includes(label) && selected.length < 2) {
      const newSelected = [...selected, label];
      setSelected(newSelected);
      setSuggestedOptions(options.filter((pronoun) => !newSelected.includes(pronoun.label)));
      setSearchTerm('');
    }
  };

  const handleOnChange = ({ value }) => {
    setSearchTerm(value);

    const suggested = value
      ? suggestedOptions.filter((item) => item.label.toLowerCase().includes(value.toLowerCase()))
      : options.filter((option) => !selected.includes(option.value));

    setSuggestedOptions(suggested);
  };

  const handleOnBlur = () => setSearchTerm('');

  const handleClear = () => {
    setSelected([]);
    setSuggestedOptions(options);
  };

  const handleOnKeyDown = ({ event: { keyCode, currentTarget } }) => {
    // Remove tag on backspace if the cursor is at the beginning of the field

    if (keyCode === 8 /* Backspace */ && currentTarget.selectionEnd === 0) {
      const newSelected = [...selected.slice(0, -1)];
      setSelected(newSelected);
      setSuggestedOptions(options.filter((pronoun) => !newSelected.includes(pronoun.label)));
    }
  };

  const handleRemoveTag = (removedValue) => {
    const newSelected = selected.filter((tagValue) => tagValue !== removedValue);
    setSelected(newSelected);
    setSuggestedOptions(options.filter((pronoun) => !newSelected.includes(pronoun.label)));
  };

  const renderedTags = selected.map((pronoun) => (
    <Tag
      key={pronoun}
      onRemove={() => handleRemoveTag(pronoun)}
      removeIconAccessibilityLabel={`Remove ${pronoun} tag`}
      text={pronoun}
    />
  ));

  return (
    <Box padding={2} width="100%" height="100%">
      <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
        <Box width={320}>
          <ComboBox
            accessibilityClearButtonLabel="Clear the current value"
            label="Pronouns"
            id="tags"
            inputValue={searchTerm}
            noResultText="No results for your selection"
            options={suggestedOptions}
            ref={ref}
            helperText="Choose up to 2 sets of pronouns to appear on your profile so others know how to refer to you. You can edit or remove these any time."
            onKeyDown={handleOnKeyDown}
            onChange={handleOnChange}
            onClear={handleClear}
            onBlur={handleOnBlur}
            onSelect={handleOnSelect}
            placeholder={selected.length > 0 ? '' : 'Add your pronouns'}
            tags={renderedTags}
          />
        </Box>
      </Flex>
    </Box>
  );
}
