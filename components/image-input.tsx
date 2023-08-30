import React from 'react'
import styled from 'styled-components'
import {Button} from '@codegouvfr/react-dsfr/Button'
import {Input} from '@codegouvfr/react-dsfr/Input'

type ImageInputProps = {
  label: string;
  onChange: (base64Image: string) => void;
  onClear?: () => void;
  value: string;
}

const Container = styled.div`
    > div {
        position: relative;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        height: 150px;
        width: 100%;

        > button {
            position: absolute;
            top: 0;
            right: 0;
        }
    }
`

export const ImageInput = ({
  label,
  onChange,
  onClear,
  value,
}: ImageInputProps) => {
  const getBase64 = () => {
    const inputElement = document.querySelector('#logo-upload-input')
    const file = (inputElement as HTMLInputElement).files[0]

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.addEventListener('load', () => {
      onChange(reader.result as string)
    })
  }

  return (
    value ? <Container className='fr-upload-group'>
      <label className='fr-label' htmlFor='file'>{label}</label>
      <div style={{backgroundImage: `url("${value}")`}}>
        <Button iconId='fr-icon-delete-bin-line'
          onClick={onClear}
          title='Supprimer' />
      </div>
    </Container> : <Input
      label={label}
      nativeInputProps={{
        id: 'logo-upload-input',
        required: true,
        type: 'file',
        accept: 'image/png, image/jpeg, image/jpg',
        onChange: getBase64}}
    />
  )
}
