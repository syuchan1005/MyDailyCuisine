import React, {
  FC,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Add, Clear } from '@material-ui/icons';
import {
  Button,
  createStyles,
  IconButton,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDropzone } from 'react-dropzone';
import { common } from '@material-ui/core/colors';

interface ImageChooseButtonProps {
  subText?: string;
  image?: File;
  onChange?: (file: File) => void;
  classes?: { root: string };
  accept?: string | string[];
}

const useStyles = makeStyles(() => createStyles({
  root: {
    objectFit: 'cover',
  },
  buttonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    color: common.white,
    background: 'rgba(0, 0, 0, 0.4)',
  },
}));

const ImageChooseButton: FC<ImageChooseButtonProps> = (props: ImageChooseButtonProps) => {
  const classes = useStyles(props);
  const {
    subText,
    image,
    onChange,
    accept,
  } = props;

  const onDrop = useCallback((f: File[]) => (onChange && onChange(f[0])), [onChange]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });

  const imageRef = useRef<HTMLImageElement>();
  useEffect(() => {
    if (imageRef.current) {
      if (image) {
        // @ts-ignore
        const { cache } = image;
        if (cache) {
          imageRef.current.src = cache;
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            // @ts-ignore
            imageRef.current.src = e.target.result;
            // @ts-ignore
            image.cache = imageRef.current.src;
          };
          reader.readAsDataURL(image);
        }
      } else {
        imageRef.current.src = undefined;
      }
    }
  }, [imageRef, image]);

  if (image) {
    return (
      <Paper className={`${classes.root} ${classes.paper}`} elevation={3}>
        <IconButton
          className={classes.deleteButton}
          onClick={() => onChange(undefined)}
        >
          <Clear />
        </IconButton>
        <img className={classes.root} ref={imageRef} alt="ChooseImage" />
      </Paper>
    );
  }

  return (
    // @ts-ignore
    <Button
      {...getRootProps()}
      className={classes.root}
      classes={{ label: classes.buttonLabel }}
      variant="contained"
    >
      <input {...getInputProps()} />
      <Add fontSize="large" />
      <div>Choose Image</div>
      {subText && (<div>{subText}</div>)}
    </Button>
  );
};

export default ImageChooseButton;
