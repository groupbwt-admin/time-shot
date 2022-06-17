import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { DrawerContent, Box, DrawerFooter, Button, Icon } from '@admin-bro/design-system'

import PropertyType from 'admin-bro/src/frontend/components/property-type'
import ActionHeader from 'admin-bro/src/frontend/components/app/action-header/action-header'
import useRecord from 'admin-bro/src/frontend/hooks/use-record/use-record'
import { appendForceRefresh } from 'admin-bro/src/frontend/components/actions/utils/append-force-refresh'
import { useTranslation } from 'admin-bro/src/frontend/hooks/use-translation'
import LayoutElementRenderer from 'admin-bro/src/frontend/components/actions/utils/layout-element-renderer'

const CustomEdit = (props) => {
  const { record: initialRecord, resource, action } = props;
  resource.editProperties = resource.editProperties.filter(prop => prop.name !== 'email');

  const {
    record,
    handleChange,
    submit: handleSubmit,
    loading,
    setRecord,
  } = useRecord(initialRecord, resource.id)
  const { translateButton } = useTranslation()
  const history = useHistory()

  useEffect(() => {
    if (initialRecord) {
      setRecord(initialRecord)
    }
  }, [initialRecord])

  const submit = (event) => {
    event.preventDefault()
    handleSubmit().then((response) => {
      if (response.data.redirectUrl) {
        history.push(appendForceRefresh(response.data.redirectUrl))
      }
    })
    return false
  }

  return (
    <Box
      as='form'
      onSubmit={submit}
      flex
      flexGrow={1}
      flexDirection='column'
    >
      <DrawerContent>
        {action?.showInDrawer ? <ActionHeader {...props} /> : null}
        {action.layout ? action.layout.map((layoutElement, i) => (
          <LayoutElementRenderer
            key={i}
            layoutElement={layoutElement}
            {...props}
            where='edit'
            onChange={handleChange}
            record={record}
          />
        )) : resource.editProperties.map(property => (
          <PropertyType
            key={property.propertyPath}
            where='edit'
            onChange={handleChange}
            property={property}
            resource={resource}
            record={record}
          />
        ))}
      </DrawerContent>
      <DrawerFooter>
        <Button variant='primary' size='lg' type='submit' data-testid='button-save'>
          {loading ? (<Icon icon='Fade' spin />) : null}
          {translateButton('save', resource.id)}
        </Button>
      </DrawerFooter>
    </Box>
  )
}
  
export default CustomEdit;
