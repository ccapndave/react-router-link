# react-router-link
An updated Link component for react-router

This adds some extra properties to the default react-router Link component so that:

a) you can select whether to use `push` or `replace` history state
b) you can choose a different event to `onClick`

### Examples
```
import { Link } from 'react-router-link'
```

Use `replaceState` so as not to alter history:
```
<Link to="/home" historyType="replace" />
```

Use `onTouchTap` from [react-tap-event-plugin](https://github.com/zilverline/react-tap-event-plugin/tree/master/src) instead of `onClick`
```
<Link to="/home" eventName="onTouchTap" />
```
