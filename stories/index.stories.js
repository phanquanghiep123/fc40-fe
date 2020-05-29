import React from 'react';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import DateFnsUtils from '@date-io/date-fns';
import Form from './FormikAndControl';
import SnackbarWrapper from '../app/components/Snackbars';
import DialogExample from './Dialog';

import InputComponent from './examples/InputComponent';
import SelectComponent from './examples/SelectComponent';
import PickersComponent from '../app/components/PickersControl';

import ExpansionExample from './Expansion';
import Code from './components/Code';
import ExpansionComponent from './examples/PropsInfoTable';
const ExpansionCode = require('!raw-loader!./Expansion');

storiesOf('Expansion', module)
  .addParameters({
    info: {
      propTables: [ExpansionComponent],
      propTablesExclude: [ExpansionExample, Code],
      text: `Style cho expansion`,
    },
  })
  .add('Basic', () => (
    <div>
      <ExpansionExample
        title="I. Thông tin biên bản"
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
      />
      <Code>{ExpansionCode}</Code>
    </div>
  ))
  .add('With right action', () => (
    <div>
      <ExpansionExample
        hasRightAction
        title="I. Thông Tin Biên Bản"
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
      />
      <Code>{ExpansionCode}</Code>
    </div>
  ));

storiesOf('Form', module)
  .addParameters({
    info: {
      propTables: [InputComponent, PickersComponent, SelectComponent],
      propTablesExclude: [MuiPickersUtilsProvider, Form],
      text: `Xác thực form với input, xem code trong /stories/FormikAndControl.js với DatePickerField, InputControl, SelectControl là các component thành phần`,
      excludedPropTypes: ['innerRef'],
    },
  })
  .add('validation', () => (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Form />
    </MuiPickersUtilsProvider>
  ));

storiesOf('Snackbar', module)
  .addParameters({
    info: {
      inline: true,
      text:
        'Hiển thị khi có thông báo của hệ thống, ví dụ: request api thất bại, thành công',
    },
  })
  .add('success', () => (
    <SnackbarWrapper
      open
      variant="success"
      message="some_message"
      onClose={action('clicked')}
    />
  ))
  .add('warning', () => (
    <SnackbarWrapper
      open
      variant="warning"
      message="some_message"
      onClose={action('clicked')}
    />
  ))
  .add('info', () => (
    <SnackbarWrapper
      open
      variant="info"
      message="some_message"
      onClose={action('clicked')}
    />
  ))
  .add('error', () => (
    <SnackbarWrapper
      open
      variant="error"
      message="some_message"
      onClose={action('clicked')}
    />
  ));

storiesOf('AlertDialogSlide', module)
  .add(
    'dialog',
    () => (
      <DialogExample isDialog title="title dialog" content="content dialog" />
    ),
    {
      info: {
        text: `Dialog đã được cấu hình từ route, đã được implement onClose
            =>  mỗi component đã được truyền một props : ui, khi sử dụng cần khai báo:
            <ui.Dialog {...ui.props} {truyền thêm các props ở đây}/>
            => isDialog: true (dialog), false: modal
        `,
      },
    },
  )
  .add(
    'Modal',
    () => (
      <DialogExample
        isDialog={false}
        title="title modal"
        content="content modal"
        fullWidth
      />
    ),
    {
      info: {
        text: `Dialog đã được cấu hình từ route, đã được implement onClose
            =>  mỗi component đã được truyền một props : ui, khi sử dụng cần khai báo:
            <ui.Dialog {...ui.props} {truyền thêm các props ở đây}/>
            => isDialog: true (dialog), false: modal
        `,
      },
    },
  );
