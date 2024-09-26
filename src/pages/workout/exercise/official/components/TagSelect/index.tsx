import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import classNames from 'classnames';
import { useMergedState } from 'rc-util';
import React, { FC, useState } from 'react';
import useStyles from './index.style';
const { CheckableTag } = Tag;
export interface TagSelectOptionProps {
  value: string | number;
  style?: React.CSSProperties;
  checked?: boolean;
  onChange?: (value: string | number, state: boolean) => void;
  children?: React.ReactNode;
}
const TagSelectOption: React.FC<TagSelectOptionProps> & {
  isTagSelectOption: boolean;
} = ({ children, checked, onChange, value }) => (
  <CheckableTag
    checked={!!checked}
    key={value}
    onChange={(state) => onChange && onChange(value, state)}
  >
    {children}
  </CheckableTag>
);

TagSelectOption.isTagSelectOption = true;

type TagSelectOptionElement = React.ReactElement<TagSelectOptionProps, typeof TagSelectOption>;

export interface TagSelectProps {
  onChange?: (value: string | number | undefined) => void;
  expandable?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  style?: React.CSSProperties;
  hideCheckAll?: boolean;
  actionsText?: {
    expandText?: React.ReactNode;
    collapseText?: React.ReactNode;
    selectAllText?: React.ReactNode;
  };
  className?: string;
  Option?: TagSelectOptionProps;
  children?: TagSelectOptionElement | TagSelectOptionElement[];
}
const TagSelect: FC<TagSelectProps> & {
  Option: typeof TagSelectOption;
} = (props) => {
  const { styles } = useStyles();
  const { children, className, style, expandable, actionsText = {} } = props;
  const [expand, setExpand] = useState<boolean>(false);

  const [value, setValue] = useMergedState<string | number | undefined>(
    props.defaultValue || undefined,
    {
      value: props.value,
      defaultValue: props.defaultValue,
      onChange: props.onChange,
    },
  );

  const isTagSelectOption = (node: TagSelectOptionElement) =>
    node &&
    node.type &&
    (node.type.isTagSelectOption || node.type.displayName === 'TagSelectOption');

  const handleTagChange = (tag: string | number, checked: boolean) => {
    if (checked) {
      setValue(tag);
    } else {
      setValue(undefined); // 如果标签取消选中，则清空选中的值
    }
  };

  const { expandText = '展开', collapseText = '收起' } = actionsText;
  const cls = classNames(styles.tagSelect, className, {
    [styles.hasExpandTag]: expandable,
    [styles.expanded]: expand,
  });

  return (
    <div className={cls} style={style}>
      {children &&
        React.Children.map(children, (child: TagSelectOptionElement) => {
          if (isTagSelectOption(child)) {
            return React.cloneElement(child, {
              key: `tag-select-${child.props.value}`,
              value: child.props.value,
              checked: value === child.props.value, // 单选时，只有一个选项与当前选中的值相匹配
              onChange: handleTagChange,
            });
          }
          return child;
        })}
      {expandable && (
        <a
          className={styles.trigger}
          onClick={() => {
            setExpand(!expand);
          }}
        >
          {expand ? (
            <>
              {collapseText} <UpOutlined />
            </>
          ) : (
            <>
              {expandText}
              <DownOutlined />
            </>
          )}
        </a>
      )}
    </div>
  );
};
TagSelect.Option = TagSelectOption;
export default TagSelect;
