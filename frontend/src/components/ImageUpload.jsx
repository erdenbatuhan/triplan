import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Tooltip,
  IconButton,
  ImageList,
  ImageListItem
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CollectionsIcon from '@mui/icons-material/Collections';
import Spinner from './common/Spinner';
import ContentModal from './common/ContentModal';
import * as cmsQueries from '../queries/cms-queries';

const avatarStyle = { width: '5em', height: '5em' };

const CMS_IMAGE_QUERY_PARAM_VERSION = '?versionId=';

const IMAGE_SELECTED_TYPE_BASE64 = 'BASE64';
const IMAGE_SELECTED_TYPE_RESTORED = 'RESTORED';

export default function ImageUpload({ objectId, image, onSaveSuccess }) {
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [previousVersions, setPreviousVersions] = useState([]);
  const [imageSelected, setImageSelected] = useState({ image });
  const [imageZoomed, setImageZoomed] = useState(false);
  const [imageLibraryShown, setImageLibraryShown] = useState(false);

  const findPreviousVersions = () => {
    setIsLoading(true);
    cmsQueries
      .findAllImages({ owner: objectId })
      .then(({ imagesFound }) => {
        imagesFound.shift(); // Remove the first element as it is the current picture
        setPreviousVersions(imagesFound);
      })
      .catch(({ response }) => alert((response && response.data) || 'An error occurred!'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!objectId) {
      return;
    }

    findPreviousVersions();
  }, [objectId]);

  const onUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const uploadImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setIsLoading(true);
      setImageSelected({ type: IMAGE_SELECTED_TYPE_BASE64, image: reader.result });

      const imageBase64 = reader.result.split(',')[1];
      cmsQueries
        .uploadImage({ owner: objectId, image: imageBase64 })
        .then(({ imageUploaded }) => {
          if (onSaveSuccess) {
            onSaveSuccess(imageUploaded);
          }
        })
        .catch(({ response }) => alert((response && response.data) || 'An error occurred!'))
        .finally(() => setIsLoading(false));
    };

    reader.readAsDataURL(file);
  };

  const restoreImage = (imageToBeRestored) => {
    setIsLoading(true);
    setImageSelected({ type: IMAGE_SELECTED_TYPE_RESTORED, image: imageToBeRestored });

    const restoredVersion = imageToBeRestored.split(CMS_IMAGE_QUERY_PARAM_VERSION)[1];
    cmsQueries
      .restoreImage({ owner: objectId, versionId: restoredVersion })
      .then(({ imageRestored }) => {
        if (onSaveSuccess) {
          onSaveSuccess(imageRestored);
        }
      })
      .catch(({ response }) => alert((response && response.data) || 'An error occurred!'))
      .finally(() => {
        setIsLoading(false);
        findPreviousVersions();
      });
  };

  return (
    <>
      <Card>
        <CardContent>
          <Grid container justify="center" alignItems="center">
            {isLoading ? (
              <Grid item xs={12}>
                <Spinner marginTop="0.5em" />
              </Grid>
            ) : (
              <>
                <Grid item xs={4}>
                  {imageSelected && imageSelected.image ? (
                    <Tooltip title="Zoom">
                      <IconButton onClick={() => setImageZoomed(true)}>
                        <Avatar sx={avatarStyle} src={imageSelected.image} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <IconButton sx={{ pointerEvents: 'none' }}>
                      <Avatar sx={avatarStyle} src={imageSelected.image} />
                    </IconButton>
                  )}
                </Grid>

                <Grid container item xs={7} justifyContent="flex-end">
                  <>
                    <Tooltip title="Upload a new image">
                      <IconButton onClick={onUploadButtonClick}>
                        <AddPhotoAlternateIcon color="primary" />
                      </IconButton>
                    </Tooltip>

                    <input
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      accept="image/*"
                      type="file"
                      onChange={uploadImage}
                    />
                  </>

                  {previousVersions && previousVersions.length > 0 ? (
                    <Tooltip title="Select from previously uploaded images">
                      <IconButton onClick={() => setImageLibraryShown(true)}>
                        <CollectionsIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    []
                  )}
                </Grid>

                <Grid item xs={1} />
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      <ContentModal
        open={imageZoomed}
        onClose={() => setImageZoomed(false)}
        contentStyle={{ maxWidth: 500 }}
        contentRendered={
          <Box
            component="img"
            sx={{
              height: '100%',
              width: '100%',
              borderRadius: '2em'
            }}
            src={imageSelected && imageSelected.image}
          />
        }
      />

      <ContentModal
        open={imageLibraryShown}
        onClose={() => setImageLibraryShown(false)}
        header="Image Library"
        contentRendered={
          <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
            {previousVersions.map((oldImage, idx) => (
              <IconButton
                key={`${oldImage}-${idx}`}
                sx={{ borderRadius: '0' }}
                onClick={() => {
                  restoreImage(oldImage);
                  setImageLibraryShown(false);
                }}>
                <ImageListItem>
                  <img src={`${oldImage}`} alt={oldImage} loading="lazy" />
                </ImageListItem>
              </IconButton>
            ))}
          </ImageList>
        }
      />
    </>
  );
}
