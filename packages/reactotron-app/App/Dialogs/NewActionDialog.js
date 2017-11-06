import React, { Component } from 'react'
import { ModalPortal, ModalBackground, ModalDialog } from 'react-modal-dialog'
import Checkbox from '../Shared/Checkbox'
import { inject, observer } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import Keystroke from '../Lib/Keystroke'

const ESCAPE_KEYSTROKE = 'Esc'
const ENTER_KEYSTROKE = `${Keystroke.modifierName} + Enter`

const INPUT_EVAL_PLACEHOLDER = "{ type: 'RepoMessage.Request' }"
const INPUT_YAML_PLACEHOLDER = 'type: RepoMessage.Request'

const ACTION_LABEL = 'Action'
const IDENTIFIER_LABEL = 'Identifier'
const IDENTIFIER_PLACEHOLDER = 'dispatch request'

const DIALOG_TITLE = 'Define Action'
const INSTRUCTIONS = <span>Pick a name and payload to store for convenient dispatching.</span>
const ESCAPE_HINT = 'Cancel'
const STORE_HINT = 'Store action'

const Styles = {
  dialog: {
    borderRadius: 4,
    padding: 4,
    width: 450,
    backgroundColor: Colors.background,
    color: Colors.foreground
  },
  container: {
    ...AppStyles.Layout.vbox
  },
  keystrokes: {
    ...AppStyles.Layout.hbox,
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    fontSize: 13
  },
  hotkey: {
    padding: '0 10px'
  },
  keystroke: {
    backgroundColor: Colors.backgroundHighlight,
    color: Colors.foreground,
    padding: '4px 8px',
    borderRadius: 4
  },
  header: {
    ...AppStyles.Layout.vbox,
    padding: '2em 2em 1em'
  },
  body: {
    ...AppStyles.Layout.vbox,
    padding: '2em 2em 4em'
  },
  title: {
    margin: 0,
    padding: 0,
    textAlign: 'left',
    fontWeight: 'normal',
    fontSize: 24,
    color: Colors.heading
  },
  subtitle: {
    color: Colors.foreground,
    textAlign: 'left',
    padding: 0,
    margin: 0
  },
  fieldLabel: {
    color: Colors.heading,
    fontSize: 13,
    textTransform: 'uppercase'
  },
  dispatchField: {
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    borderBottom: `1px solid ${Colors.line}`,
    fontSize: 23,
    color: Colors.foregroundLight,
    backgroundColor: 'inherit',
    height: 200
  },
  checkboxPadding: {
    marginTop: 10,
    paddingTop: 4,
    paddingBottom: 4
  },

  input: {
    paddingTop: 4,
    paddingBottom: 8,
    border: 'none',
    backgroundColor: 'inherit',
    fontSize: 23,
    color: Colors.foregroundLight
  }
}

@inject('session')
@observer
class NewActionDialog extends Component {
  constructor (props) {
    super(props)
    this.state = {
      yaml: false
    }
  }

  toggleYAML = () => {
    this.setState({ yaml: !this.state.yaml })
  }

  render () {
    const { ui } = this.props.session
    const useYAML = this.state.yaml

    return (
      <ModalPortal>
        <ModalBackground onClose={ui.closeDialog}>
          <ModalDialog style={Styles.dialog}>
            <div style={Styles.container}>
              <div style={Styles.header}>
                <h1 style={Styles.title}>{DIALOG_TITLE}</h1>
                <p style={Styles.subtitle}>{INSTRUCTIONS}</p>
              </div>
              <div style={Styles.body}>
                <label style={Styles.fieldLabel}>{IDENTIFIER_LABEL}</label>
                <input style={Styles.input} placeholder={IDENTIFIER_PLACEHOLDER} />
                <div style={Styles.checkboxPadding}>
                  <Checkbox checked={useYAML} label={'Use YAML'} onToggle={this.toggleYAML} />
                </div>
                <label style={Styles.fieldLabel}>{ACTION_LABEL}</label>
                <textarea
                  placeholder={useYAML ? INPUT_YAML_PLACEHOLDER : INPUT_EVAL_PLACEHOLDER}
                  style={Styles.dispatchField}
                  type='text'
                  ref={node => (this.field = node)}
                  value={ui.actionToDispatch}
                  onKeyPress={this.handleKeyPress}
                  onChange={this.handleChange}
                />
              </div>
              <div style={Styles.keystrokes}>
                <div style={Styles.hotkey}>
                  <span style={Styles.keystroke}>{ESCAPE_KEYSTROKE}</span> {ESCAPE_HINT}
                </div>
                <div style={Styles.hotkey}>
                  <span style={Styles.keystroke}>{ENTER_KEYSTROKE}</span> {STORE_HINT}
                </div>
              </div>
            </div>
          </ModalDialog>
        </ModalBackground>
      </ModalPortal>
    )
  }
}

export default NewActionDialog
