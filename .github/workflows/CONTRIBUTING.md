# Contributing

Thank you for your interest in contributing to this project! We appreciate your help in making this project better.

## Testing Changes

Before submitting your pull request, please ensure that your changes do not break the build. To test your changes:

1. Run the following command in the root folder of the project to build the demo applications:

   ```bash
   npm run build:js:public
   ```

2. After the build process is successful, try to host the project locally using a tool like [`http-server`](https://npmjs.com/http-server):

   ```bash
    http-server docs/
   ```

3. Open your web browser and navigate to `http://localhost:8080` (or the port specified by `http-server`) to view the hosted project. Click through the generated applications and make sure they work.

## Submitting Changes

Once you have made and tested your changes:

1. Commit your changes with a descriptive commit messages.
2. Push your changes and create a PR summarizing the changes you've made.
3. Wait for an approval and then **squash-merge** to the `main`, the CD will take care of the deployment process.
4. Make sure the deployment job was successfull by visiting `https://getstream.io/chat/demos`, test your changes there as well. Unsuccessful jobs won't publish, debug accordingly.
