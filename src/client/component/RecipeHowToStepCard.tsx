import React, { FC, ReactNode } from 'react';
import {
  Card,
  createStyles,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ImageChooseButton from '@client/component/ImageChooseButton';

interface RecipeHowToStepCardProps {
  elevation?: number;
  children?: ReactNode;

  image?: File;
  changeImage?: (image: File) => void;
  description?: string;
  changeDescription?: (text: string) => void;
}

const useStyles = makeStyles(() => createStyles({
  counterText: {
    width: '100%',
    '& > p': {
      textAlign: 'end',
    },
  },
  imageHolder: {
    background: 'rgba(0, 0, 0, 0)',
    // width: 136,
    width: '100%',
    maxHeight: 491,
  },
  imageHolderLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    width: 200,
  },
}));

const RecipeHowToStepCard: FC<RecipeHowToStepCardProps> = (props: RecipeHowToStepCardProps) => {
  const classes = useStyles(props);
  const {
    elevation,
    children,
    image,
    changeImage,
    description,
    changeDescription,
  } = props;

  return (
    <Card className={classes.card} elevation={elevation}>
      <ImageChooseButton
        image={image}
        onChange={(f) => (changeImage && changeImage(f))}
        classes={{ root: classes.imageHolder }}
        subText="(resize 136x491)"
        accept="image/jpeg"
      />
      {children}
      <TextField
        className={classes.counterText}
        multiline
        rowsMax={4}
        helperText="0/60"
        value={description}
        onChange={(event) => (changeDescription && changeDescription(event.target.value))}
      />
    </Card>
  );
};

export default RecipeHowToStepCard;
