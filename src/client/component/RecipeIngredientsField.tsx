import React, {
  CSSProperties,
  FC,
  forwardRef,
  PropsWithChildren,
  useState,
} from 'react';
import {
  Button,
  createStyles, IconButton, InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add, Clear, Reorder } from '@material-ui/icons';
import { ReactSortable } from 'react-sortablejs';

const ForwardTableBody = forwardRef<Element, PropsWithChildren<object>>(
  (props: PropsWithChildren<object>, ref) => (
    <TableBody ref={ref}>
      {props.children}
    </TableBody>
  ),
);

export type Ingredient = {
  id: number;
  name: string;
  groupName?: string;
  amount: string;
};

interface RecipeIngredientsFieldProps {
  value: Ingredient[];
  onChange?: (ingredients: Ingredient[]) => void;
  howMany: string;
  changeHowMany?: (str: string) => void;
  style?: CSSProperties;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  header: {
    display: 'flex',
    alignItems: 'baseline',
  },
  howMany: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(10),
    '& > p': {
      textAlign: 'end',
    },
  },
  iconCell: {
    width: theme.spacing(3),
    padding: theme.spacing(0, 0.5),
    color: 'rgba(0, 0, 0, 0.54)',
  },
  iconCellCenter: {
    display: 'flex',
  },
  inputCell: {
    padding: '0 24px 0 16px',
  },
}));

const RecipeIngredientsField: FC<RecipeIngredientsFieldProps> = (
  props: RecipeIngredientsFieldProps,
) => {
  const classes = useStyles(props);
  const {
    value,
    onChange,
    style,
    howMany,
    changeHowMany,
  } = props;

  const [uid, setUid] = useState(1);

  const addItem = React.useCallback(() => {
    if (onChange) {
      onChange([...value, {
        id: uid,
        name: '',
        groupName: undefined,
        amount: '',
      }]);
    }
    setUid(uid + 1);
  }, [value, uid]);

  const editItem = React.useCallback((id: number, key: 'name' | 'amount' | 'groupName', text: string) => {
    const list = [...value];
    list[list.findIndex((v) => v.id === id)][key] = text;
    if (onChange) onChange(list);
  }, [value]);

  const deleteItem = React.useCallback((id: number) => {
    if (onChange) onChange(value.filter((v) => v.id !== id));
  }, [value]);

  return (
    <div style={style}>
      <div className={classes.header}>
        <Typography variant="h6">
          Ingredients
        </Typography>
        <TextField
          className={classes.howMany}
          label="how many"
          placeholder="(ex. 2)"
          helperText={`${howMany.length}/10`}
          onChange={(e) => (changeHowMany && changeHowMany(e.target.value))}
          value={howMany}
        />
      </div>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.iconCell} />
              <TableCell>Group[30]</TableCell>
              <TableCell>Name[100]</TableCell>
              <TableCell align="right">Amount[50]</TableCell>
              <TableCell className={classes.iconCell} />
            </TableRow>
          </TableHead>
          <ReactSortable
            tag={ForwardTableBody}
            list={value}
            setList={(list) => (onChange && onChange(list.map((l) => {
              const a = { ...l };
              // @ts-ignore
              delete a.chosen;
              return a;
            })))}
            handle=".handle"
            animation={150}
          >
            {value.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell className={classes.iconCell}>
                  <div className={classes.iconCellCenter}><Reorder className="handle" /></div>
                </TableCell>
                <TableCell className={classes.inputCell}>
                  <InputBase
                    placeholder="group"
                    value={ingredient.groupName}
                    onChange={(event) => editItem(ingredient.id, 'groupName', event.target.value)}
                  />
                </TableCell>
                <TableCell className={classes.inputCell}>
                  <InputBase
                    placeholder="name"
                    value={ingredient.name}
                    onChange={(event) => editItem(ingredient.id, 'name', event.target.value)}
                  />
                </TableCell>
                <TableCell align="right" className={classes.inputCell}>
                  <InputBase
                    placeholder="amount"
                    value={ingredient.amount}
                    onChange={(event) => editItem(ingredient.id, 'amount', event.target.value)}
                  />
                </TableCell>
                <TableCell className={classes.iconCell}>
                  <IconButton size="small" onClick={() => deleteItem(ingredient.id)}>
                    <Clear />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </ReactSortable>
        </Table>
        <Button fullWidth variant="outlined" onClick={addItem}>
          <Add />
        </Button>
      </TableContainer>
    </div>
  );
};

export default RecipeIngredientsField;
