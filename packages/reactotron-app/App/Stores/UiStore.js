import { observable, action, asMap } from 'mobx'
import Mousetrap from '../Lib/Mousetrap.min.js'
import { isNilOrEmpty } from 'ramdasauce'
import Keystroke from '../Lib/Keystroke'
import { safeLoad } from 'js-yaml'

/**
 * Handles UI state.
 */
class UI {
  /**
   * Which tab are we on?
   */
  @observable tab = 'timeline'
  @observable currentDialog = null

  dialogues = {
    stateDispatch: {
      onOpen: () => {
        console.log('Dispatch opened.')
      },
      onClose: () => {
        console.log('Dispatch closed.')
      },
      onSubmit: () => {
        console.log('Dispatch submitted.')
        let action = null
        try {
          // brackets are need on chromium side, huh.
          action = this.actionUseYAML
            ? safeLoad(this.actionToDispatch)
            : eval('(' + this.actionToDispatch + ')') // eslint-disable-line
        } catch (e) {
          console.error(e)
        }
        // jet if not valid
        if (isNilOrEmpty(action)) return

        // let's attempt to dispatch
        this.dispatchAction(action)
      },
    },
    stateFind: {
      onPop: () => {
        this.closeDialog()
      },
    },
    stateWatch: {
      onFormSubmit: () => {
        console.log('Ey')
        this.server.stateValuesSubscribe(this.watchToAdd)
        this.watchToAdd = null
      },
    },
    stateRename: {
      onOpen: backup => {
        this.backupStateName = backup.payload.name
        this.currentBackupState = backup
      },
      onFormSubmit: () => {
        this.currentBackupState.payload.name = this.backupStateName
        this.backupStateName = null
      },
    },
    help: {
      onPop: () => {
        this.closeDialog()
      },
    },
    timelineFilter: {},
    newAction: {},
  }

  /**
   * Targets state keys or values from the UI & commands.
   */
  @observable keysOrValues = 'keys'

  // the current watch to add
  @observable watchToAdd

  // the current name of a backup
  @observable backupStateName

  // use yaml as action parser
  @observable actionUseYAML = false

  // the current action to dispatch
  @observable actionToDispatch

  // show the watch panel?
  @observable showWatchPanel = false

  // additional properties that some commands may want... a way to communicate
  // from the command toolbar to the command
  commandProperties = {}

  constructor(server) {
    this.server = server

    Mousetrap.prototype.stopCallback = () => false

    Mousetrap.bind(`${Keystroke.mousetrap}+k`, this.reset)
    Mousetrap.bind(`${Keystroke.mousetrap}+f`, () => {
      this.openDialog('stateFind')
    })
    Mousetrap.bind(`${Keystroke.mousetrap}+shift+f`, () => {
      this.openDialog('timelineFilter')
    })
    Mousetrap.bind(`${Keystroke.mousetrap}+d`, () => {
      this.openDialog('stateDispatch')
    })
    Mousetrap.bind(`${Keystroke.mousetrap}+s`, this.backupState)
    Mousetrap.bind(`tab`, this.toggleKeysValues)
    Mousetrap.bind(`escape`, this.popState)
    Mousetrap.bind(`enter`, () => {
      this.submitForm()
    })
    Mousetrap.bind(`${Keystroke.mousetrap}+enter`, () => {
      this.submitDialog()
    })
    Mousetrap.bind(`${Keystroke.mousetrap}+n`, () => {
      this.openDialog('stateWatch')
    })
    Mousetrap.bind(`${Keystroke.mousetrap}+1`, this.switchTab.bind(this, 'timeline'))
    Mousetrap.bind(`${Keystroke.mousetrap}+2`, this.switchTab.bind(this, 'subscriptions'))
    Mousetrap.bind(`${Keystroke.mousetrap}+3`, this.switchTab.bind(this, 'backups'))
    Mousetrap.bind(`${Keystroke.mousetrap}+4`, this.switchTab.bind(this, 'native'))
    Mousetrap.bind(`${Keystroke.mousetrap}+/`, this.switchTab.bind(this, 'help'))
    Mousetrap.bind(`${Keystroke.mousetrap}+?`, this.switchTab.bind(this, 'help'))
  }

  @action
  switchTab = newTab => {
    this.tab = newTab
  }

  @action
  popState = (...args) => {
    const dialog = this.currentDialog
    const events = this.dialogues[dialog]
    if (!events) return
    events.onPop && events.onPop(...args)
  }

  @action
  removeStateWatch = path => {
    this.server.stateValuesUnsubscribe(path)
  }

  @action
  clearStateWatches = () => {
    this.server.stateValuesClearSubscriptions()
  }

  @action
  setActionToDispatch(action) {
    this.actionToDispatch = action
    this.openDialog('stateDispatch')
  }

  @action
  toggleActionYAML = () => {
    this.actionUseYAML = !this.actionUseYAML
  }

  @action
  submitStateDispatch = () => {
    // try not to blow up the frame
    let action = null
    try {
      // brackets are need on chromium side, huh.
      action = this.actionUseYAML
        ? safeLoad(this.actionToDispatch)
        : eval('(' + this.actionToDispatch + ')') // eslint-disable-line
    } catch (e) {
      console.error(e)
    }
    // jet if not valid
    if (isNilOrEmpty(action)) return

    // let's attempt to dispatch
    this.dispatchAction(action)
    // close the form
    this.showStateDispatchDialog = false
  }

  @action
  openDialog = (dialog, ...args) => {
    this.currentDialog = dialog
    const events = this.dialogues[dialog]
    if (!events) return
    events.onOpen && events.onOpen(...args)
  }

  @action
  closeDialog = (...args) => {
    const dialog = this.currentDialog
    this.currentDialog = null
    const events = this.dialogues[dialog]
    if (!events) return
    events.onClose && events.onClose(...args)
  }

  @action
  submitDialog = (...args) => {
    const dialog = this.currentDialog
    const events = this.dialogues[dialog]
    if (events) {
      events.onSubmit && events.onSubmit(...args)
    }

    this.closeDialog(dialog)
  }

  @action
  submitForm = (...args) => {
    const dialog = this.currentDialog
    const events = this.dialogues[dialog]
    if (!events) return

    events.onFormSubmit && events.onFormSubmit(...args)
  }

  @action
  getStateKeysOrValues = path => {
    if (this.keysOrValues === 'keys') {
      this.getStateKeys(path)
    } else {
      this.getStateValues(path)
    }
  }

  @action
  getStateValues = path => {
    this.server.stateValuesRequest(path)
  }

  @action
  getStateKeys = path => {
    this.server.stateKeysRequest(path)
  }

  @action
  dispatchAction = action => {
    this.server.stateActionDispatch(action)
  }

  @action
  toggleKeysValues = () => {
    if (this.keysOrValues === 'keys') {
      this.keysOrValues = 'values'
    } else {
      this.keysOrValues = 'keys'
    }
  }

  @action
  toggleWatchPanel = () => {
    this.showWatchPanel = !this.showWatchPanel
  }

  // grab a copy of the state for backup purposes
  @action backupState = () => this.server.stateBackupRequest()

  // change the state on the app to this
  @action restoreState = state => this.server.stateRestoreRequest(state)

  // removes an existing state object
  @action
  deleteState = state => {
    this.server.commands['state.backup.response'].remove(state)
  }

  getCommandProperty = (messageId, key) => {
    const props = this.commandProperties[messageId]
    if (props) {
      return props.get(key)
    } else {
      this.commandProperties[messageId] = observable(asMap({}))
      return this.commandProperties[messageId].get(key, null)
    }
  }

  @action
  setCommandProperty = (messageId, key, value) => {
    // console.log('setting', messageId, key, value, this.commandProperties)
    if (!this.commandProperties[messageId]) {
      this.commandProperties[messageId] = observable(asMap({}))
    }
    this.commandProperties[messageId].set(key, value)
  }

  /**
   * Asks the client to the file in the editor
   */
  @action openInEditor = (file, lineNumber) => this.server.openInEditor({ file, lineNumber })

  /**
   * Sets the properties of the overlay shown on the React Native app.
   */
  @action setOverlay = props => this.server.send('overlay', props)
}

export default UI
