import React, { CSSProperties, FC, useState } from 'react';
import {
  createStyles,
  IconButton,
  Theme,
  Typography,
} from '@material-ui/core';
import RecipeHowToStepCard from '@client/component/RecipeHowToStepCard';
import { Add, Clear, Reorder } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { ReactSortable } from 'react-sortablejs';

export type Step = {
  id: number;
  image?: File;
  description: string;
};

interface RecipeHowToFieldProps {
  steps: Step[];
  onChange?: (steps: Step[]) => void;
  style?: CSSProperties;
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  cardMenu: {
    display: 'flex',
  },
  cardMenuTitle: {
    flexGrow: 1,
  },
  handleWrapper: {
    color: 'rgba(0, 0, 0, 0.54)',
    display: 'flex',
    alignItems: 'center',
  },
  stepCardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 200px)',
    gridGap: theme.spacing(1),
  },
  addIcon: {
    marginLeft: theme.spacing(0.5),
  },
}));

const RecipeHowToField: FC<RecipeHowToFieldProps> = (props: RecipeHowToFieldProps) => {
  const classes = useStyles(props);
  const {
    steps,
    onChange,
    style,
    className,
  } = props;

  const [uid, setUid] = useState(1);

  const addItem = React.useCallback(() => {
    if (onChange) {
      onChange([...steps, {
        id: uid,
        image: undefined,
        description: '',
      }]);
    }
    setUid(uid + 1);
  }, [steps, uid]);

  const changeItem = React.useCallback((id, key, value) => {
    const list = [...steps];
    list[list.findIndex((v) => v.id === id)][key] = value;
    if (onChange) onChange(list);
  }, [steps]);

  const deleteItem = React.useCallback((id: number) => {
    if (onChange) onChange(steps.filter((v) => v.id !== id));
  }, [steps]);

  return (
    <div style={style} className={className}>
      <Typography variant="h6">
        How to
        <IconButton
          size="small"
          className={classes.addIcon}
          onClick={addItem}
        >
          <Add />
        </IconButton>
      </Typography>
      <ReactSortable
        list={steps}
        setList={(list) => (onChange && onChange(list.map((l) => {
          const a = { ...l };
          // @ts-ignore
          delete a.chosen;
          return a;
        })))}
        className={classes.stepCardGrid}
        handle=".handle"
        animation={150}
      >
        {steps.map((step, i) => (
          <RecipeHowToStepCard
            key={step.id}
            description={step.description}
            changeDescription={(t) => changeItem(step.id, 'description', t)}
            image={step.image}
            changeImage={(f) => changeItem(step.id, 'image', f)}
          >
            <div className={classes.cardMenu}>
              <Typography className={classes.cardMenuTitle} variant="h6">{`${i + 1}.`}</Typography>
              <div className={classes.handleWrapper}><Reorder className="handle" /></div>
              <IconButton size="small" onClick={() => deleteItem(step.id)}><Clear /></IconButton>
            </div>
          </RecipeHowToStepCard>
        ))}
      </ReactSortable>
    </div>
  );
};

export default RecipeHowToField;
