# react-hubspot-form

A React component to render HubSpot forms.

## Installation

With npm:

```bash
npm install --save react-hubspot-form
```

Or with Yarn:

```bash
yarn add react-hubspot-form
```

## Usage

```jsx
import HubspotForm from 'react-hubspot-form'

...

<HubspotForm
   portalId='your_portal_id'
   formId='your_form_id'
   onSubmit={() => console.log('Submit!')}
   onReady={(form) => console.log('Form ready!')}
   loading={<div>Loading...</div>}
   />
```

## Options

You can also set any [additional options that HubSpot provides](https://developers.hubspot.com/docs/methods/forms/advanced_form_options) as properties in the component.