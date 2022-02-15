<p align="center">
  <a href="https://wodo.io/" target="blank"><img src="https://github.com/wodo-platform/wg-web-ui/blob/master/app/img/_src/branding/logo_purple.png" width="320" alt="Wodo Platform" /></a>
</p>

<div align="center">
<h2> Wodo Platform NodeJs Template Application </h2>
</div>

<div align="center">
  <h4>
    <a href="https://wodo.io/">
      Website
    </a>
    <span> | </span>
    <a href="#">
      Product Docs
    </a>
    <span> | </span>
    <a href="#">
      Architecture Docs
    </a>
    <span> | </span>
    <!-- <a href="#"> -->
    <!--   CLI -->
    <!-- </a> -->
    <!-- <span> | </span> -->
    <a href="#/CONTRIBUTING.md">
      Contributing
    </a>
    <span> | </span>
    <a href="https://twitter.com/wodoio">
      Twitter
    </a>
    <span> | </span>
    <a href="https://t.me/wodoio">
      Telegram
    </a>
    <span> | </span>
    <a href="https://discord.gg/fbyns8Egpb">
      Discourd
    </a>
    <span> | </span>
    <a href="https://wodoio.medium.com/">
      Medium
    </a>
    <span> | </span>
    <a href="https://www.reddit.com/r/wodoio">
      Reddit
    </a>
  </h4>
</div>

<h3> Table of Contents </h3> 

- [About](#about)
- [Development Environment](#development-environment)
- [Technical Overview](#technical-overview)
  - [Dev Lifecycle Steps](#dev-lifecycle-steps)
  - [Command Reference](#command-reference)
- [Instantiate MySQL Instance for Development Purpose](#instantiate-mysql-instance-for-development-purpose)
- [Generate Prisma artifacts](#generate-prisma-artifacts)
- [NestJS framework & Development Best Practices](#nestjs-framework--development-best-practices)
  - [NestJS Fundamentals](#nestjs-fundamentals)
  - [Add a new NestJS Module](#add-a-new-nestjs-module)
    - [Add DemoUser module](#add-demouser-module)
    - [Add "api" path configuration for all controllers in demouser module](#add-api-path-configuration-for-all-controllers-in-demouser-module)
    - [Add new DemoUser entity to prisma/schema.prisma file](#add-new-demouser-entity-to-prismaschemaprisma-file)
    - [Add DemoUserDto class](#add-demouserdto-class)
    - [Bind persistency layer to service layer](#bind-persistency-layer-to-service-layer)
  - [Validation & Error Codes](#validation--error-codes)
    - [Validation Pipes](#validation-pipes)
  - [Unit Tests & Integration Tests](#unit-tests--integration-tests)
- [Add wodo npm package dependencies](#add-wodo-npm-package-dependencies)
  - [Github Actions](#github-actions)
- [Running the app](#running-the-app)
- [Building docker image](#building-docker-image)
- [Publish The Module as NPM Package Locally](#publish-the-module-as-npm-package-locally)
- [CI and Github Workflows](#ci-and-github-workflows)
- [Next Steps](#next-steps)

----

# About

This is a template/boilerplate repository to speed up development process. New nodejs microservices application/repositories can be created based on this template. The microservices are built upon NestJS and prisma frameworks. 

> please do not forget to add "@wodo-platform/"  to name of your module in package.json file in order to publish it to the github npm repo.

The following steps are covered in this guideline:

- Development environment details
- Run a local MySQL Instance.
- Genereate your db schema sql file and create your database on the local MySql instance using Prisma framework.
- Build and start your microservices locally, establish database connectivity and run tests.
- Clean up and purge MySQL instance including persistance volumes and configs in cases needed.

> Note: More development lifecyle steps will be added in order to incrase the development efficiency; eg: running integration and automated tests locally.

# Development Environment

You must have NodeJS version 14.x (includes npm 6.x) installed in your dev environment. 

```bash
node -v
npm -v
npx -v
```

You can find intallation guidelines at <a href="https://nodejs.org/en/download/">this link.</a>

Wodo platform depends on private npm,docker and helm package repositories hosted on github. If your microservice has dependencies to other wodo npm packages, you must genereate a github token and set up private repository access for your local development environment.

**Generate Github Access Token**

Access to https://github.com/settings/tokens and click "generate new token" button. Add a note for you rtoken and select "No expiration" on Expiration field.

In the scope session, select "repo", "write:packages" and "read:packages" options. Click "generate token" and then copy your token.

> Do not share your token with anyone

**npm login - Private Repo Access**

On your terminal (bash), run the command below to add Wodo private repository to your local npm repo list. You  will be promted to enter

- Username: ${your git username }
- Password: ${your github token}
- email: ${your email on your github account}

```bash
 npm login --scope=@wodo-platform --registry=https://npm.pkg.github.com
```

The command changes/creates ".npmrc" file in your user home directory. Make sure that you have ".npmrc" file properly created with the content below in your user home directory

```
//npm.pkg.github.com/:_authToken=your_github_token
@wodo-platform:registry=https://npm.pkg.github.com
registry=https://registry.npmjs.org
```

If any line is missin in your ".npmrc" file, please add it manually. Do double check "your_github_token" is correct on in the file.

# Technical Overview

The repo infrastcuture relies on docker-compose tool to configure/instantiate database layer, and standard nodejs/npm commands to build and run the microservice. All configurations and flow are defined in "docker-compose.yaml", ".env", "prisma/schema.prisma" and "package.json" files in the root project directoy. Please review and study these files to understand the build and test lifecycles. 

> Note: Please review and configure ".env" file in advance. The file is crucial for MySQL DB configurations, prisma framework schema generation and your microservice at runtime.  

You will find detailed inforamtion about each step of the development lifecycle in the following sections. It is briefly described below as a reference point. You need to work in the project root directory.

## Dev Lifecycle Steps

1. **MySQL setup:** Run "docker-compose up" command. It reads ".env" file,  builds the MySQL impage from "db" directory and creates your database user and database instance. You will see console outputs indicating successfull start of MySQL. Keep the terminal open and start a new terminal to continue.
2. **MySQL Access Conf:** If you set up your db for the first time (or you purged your MySQL instance and now you set it up again), you need to give privilages to your MySQL user so that Prisma framework can manuplate your MySql DB. It is one-time task. You do not need to repeat this task each time you run "docker-compose up". 
    - Run **"docker ps"** command to find and copy your MySQL container id
    - Start a MySQL client session with root user, run command below, enter your root password
      ```bash 
      docker container exec -it <your_container_id> mysql -u root -p
      ```
    - Run the command below on the sql client session to grant privilages to your MySQL DB user (wodo_demo).  
      ```bash 
      GRANT ALL PRIVILEGES ON *.* to 'wodo_demo'@'%';
      flush privileges;
      ```
    - Terminate the session by running **"exit"** command
3. **Create your database:** Once your MySQL DB is up, run **"npm run db:migrate"** command to generate your database schema sql files and create your database instance on the running MySQL instance. You need to complete this step in the initial stage or repeat it whenever you do some changes in **"prisma/schema.prisma"** file. **"npm run db:migrate"** is defined in the package.json file. It eventually executes **"dotenv -e ../.env -- npx prisma migrate dev --name init"** command. Once the command is executed, you will see generated schema file under **"prisma\migrations\"** folder, eg: prisma\migrations\20220209150351_init.  
   - **Update your database:** If you add a new entity or change something in **"prisma/schema.prisma"** file, you need to run db migration again to apply your changes to your running DB instance and generate prisma client artifacts again. You need to rename the migration name in "package.json" file therefore change the parameter value "--name init" with a proper tag, eg "--name user_table_added" in the command **"dotenv -e ../.env -- npx prisma migrate dev --name init"**. Run the command **"npm run db:migrate"** again to generate your new migration.
4. **Start your microservice:** Run **"npm start"** in order to bootstrap your microservice. Prisma framework reads the same ".env" file and establish connection to your MySQL user at runtime. See src/service/prisma.service.ts file for further details
5. **Query the api** **"http://localhost:3000/api/demos"** on your browser.It should return an empty list
6. **Clean up:** Optional: You can run  **"docker-compose down -v"** and **"docker-compose down --rmi 'all'"** commands to wipe out your MySQL setup and start over. It does full clean up. If you want to stop your MySQL instance, just hit "ctrl+C" on the mysql terminal.

> Note: When you shut down your MySQL instance(ctrl+C), your confs and database instance remains intact. You can run "docker-compose up" again and continue working

> Note: Once you migrate your db and generate prisma client files, your IDE might not recognize the new prisma client because of dependency file cache in the IDE itself. Try to refresh your project and run "npm install" to refresh your dependency tree. You should see your database entity objects in "node_modules\\.prisma\client\index.d.ts" file 

## Command Reference

```bash 
docker-compose up
docker ps
docker container exec -it <your_container_id> mysql -u root -p
  GRANT ALL PRIVILEGES ON *.* to 'wodo_demo'@'%';
  flush privileges;
npm run db:migrate
npm run db:generate
npm start
```

In case you want to purge MySql setup

```bash 
docker-compose down -v
docker-compose down --rmi 'all'
```

# Instantiate MySQL Instance for Development Purpose

We use "docker-compose" to run MySQL instances locally. It is a more comprehensive way to leverage docker. All MySQL configurations are defined in ".env" in the project root directory. The same env file is used by "prisma migrate" which is explained in the next section. Ultimately we consolidate all required configurations in one simple env file.

```bash 
MYSQLDB_ROOT_USER=root
MYSQLDB_ROOT_PASSWORD=password
MYSQLDB_WODO_USER=wodo_demo
MYSQLDB_WODO_PASSWORD=123456
MYSQLDB_WODO_DATABASE=wodo_demo_db
MYSQLDB_LOCAL_PORT=3306
MYSQLDB_DOCKER_PORT=3306

# in case node application is configured in the same docker-compose.yaml file.Not used at the moment in this repo
NODE_LOCAL_PORT=3000
NODE_DOCKER_PORT=3000 

# prisma migarte DB url in the form of DATABASE_URL="mysql://$MYSQLDB_WODO_USER:$MYSQLDB_WODO_PASSWORD@localhost:$MYSQLDB_LOCAL_PORT/$MYSQLDB_WODO_DATABASE"
DATABASE_URL="mysql://wodo_demo:123456@127.0.0.1:3306/wodo_demo_db"
```

We build our own MySql docker image. All definition files are stored in "db" folder. Docker Compose builds the docker image and instantiates it when "docker-compose up" command is executed.

docker-compose.yaml file contains all definitions/configurations to run MySQL DB instance. Important configurations:

- "**build:** ./db" --> Builds our own MySQL docker image using the files in db folder.
- "**command:** --default-authentication-plugin=mysql_native_password" --> Adjust default auth type to "mysql_native_password" since MySQL 8.x version uses sha encrypted auth model by defaul. It is quick tweak to adjust the configuration
- "**env_file:** ./.env" --> passing our main conf file to docker-compose. The confs are consolidated in one simple file.
- "**environment:** .... "  --> Setting up root user password, creating wodo_demo user with password and creating default wodo_demo_db database
- "**ports:** ... " --> Port forwarding from our local env to docker container
- "**volumes:**" --> Creating persistance storage to not loose MySQL confs and data when we shut MySQL down

To start MySQL instance, run the following command. It prints logs to terminal. To stop MySQL, just hit "ctrl+C"

```bash 
docker-compose up
```

You need to run this command in the project root directory where docker-compose.yaml file resides. You can keep your terminal running and continue development on other terminals.

To validate MySql instance, run the following commands. It lets you open a mysql command line session in the running docker container. First find out your running MySQL docker container name

```bash 
docker ps
```
From the command output, copy the container name. In the sample case, it is "wodo-nodejs-persistence_mysqldb_1". The value is used in the command below to instantiate a MySQL command line session.

```bash 
docker container exec -it wodo-nodejs-persistence_mysqldb_1 mysql -u root -p
```

Once you are connected to MySql command line, run the following commands one by one. We need to give permission to our new user "wodo" to be able to run "prisma migrate" properly.

```bash 
GRANT ALL PRIVILEGES ON *.* to 'wodo_demo'@'%';
flush privileges;
```

Run exit command to terminate the sessiom

```bash 
exit;
```

In case you need to wipe out everything and start over, run the following command. It will remove MySql confs, volumes and everything else.

```bash 
docker-compose down -v
docker-compose down --rmi 'all'
```


# Generate Prisma artifacts

Prisma Migrate tool needs a running MySQL db instance. If you do not have one, please follow the instructions in the previous section. All required prisma commands are defined in "package.json" file as it is the main build and packaging tool.

```json 
    "scripts": {
        "db:migrate": "dotenv -e ../.env -- npx prisma migrate dev --name init",
        "db:introspect": "dotenv -- prisma introspect",
        "db:generate": "dotenv -- prisma generate",
        .
        .
        .
    },
```

".env" file in the project root directory contains the conf parameter "DATABASE_URL" that is needed by "prisma migrate" command. You need to set up correct values based on your definitions. 

```bash 
DATABASE_URL="mysql://wodo_demo:123456@127.0.0.1:3306/wodo_demo_db"
```

Note: If your DB user does not have proper rights to create a database, please run the following SQL commands with root user. Replace db user "wodo" with your db user.

```bash 
GRANT ALL PRIVILEGES ON *.* to 'wodo_demo'@'%';
flush privileges;
```

To create/update all tables in the new database make the database migration from the prisma schema defined in prisma/schema.prisma. Every time you run the migrate task you should provide a new name. If it is not your rist run,  change the "--name init" with something else such as "-name added_user_table"  in the package.json file.

```bash 
npm run db:migrate
```
The command invokes the line defined in package.json file.

```bash 
"db:migrate": "dotenv -e ../.env -- npx prisma migrate dev --name init" 
```

It creates a new SQL migration file for this migration in "prisma" folder and runs the SQL migration file against your dev database that you defined within "MYSQLDB_WODO_USER" in ".env" file.


More info can be found at this link https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate

Now generate the prisma client from the migrated database with the following command

```bash 
npm run db:generate
```
It generates prisma client js package including PrismeServce that your microservice depens on to drive database tasks. 

The database tables are now set up and the prisma client is generated. For more information see the docs:

- https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project-typescript-mysql


# NestJS framework & Development Best Practices

<a href="https://docs.nestjs.com/">Nest (NestJS) </a> is a framework for building efficient, scalable Node.js server-side applications. All nodejs microservices are built upon NestJS framework in Wodo development ecosystem. Nest provides an out-of-the-box application architecture which allows developers and teams to create highly testable, scalable, loosely coupled, and easily maintainable applications.

**Installation**

The boilerplate microservice already includes all NestJS npm dependencies. You need to install NestJS command line interface to run tasks that helps developers implement NestJS components and configurations.

```bash
npm i -g @nestjs/cli
```

## NestJS Fundamentals

A NestJS application contists of modules and each application has at least one module, a root module. The root module is the starting point Nest uses to build the application graph - the internal data structure Nest uses to resolve module and provider relationships and dependencies. Modules are effective ways to organize our business logic. The target architecture employs multiple modules, each encapsulating a closely related set of capabilities.

In project root folder src directory includes fundamental framework components.

- src
  - app.controller.spec.ts
  - app.controller.ts
  - app.module.ts
  - app.service.ts
  - main.ts

the main.ts includes an async function, which will bootstrap NestJS application.

The **@Module()** decorator takes a single object whose properties describe the module:

- **providers**	that will be instantiated by the Nest injector and that may be shared at least across this module. All service classes including business logic and persistency classes including database functionalities are in that category
- **controllers**	the set of controllers defined in this module which have to be instantiated. Default controller type is REST API.
- **imports**	the list of imported modules that export the providers which are required in this module. It is the way to depend on other modules. 
- **exports**	the subset of providers that are provided by this module and should be available in other  modules which import this module. You can use either the provider itself or just its token (provide value)

If you look at the imports in app.module.ts file, you will notice "DemoModule". NestJS analysis all modules in the root app module and process all fundamental framework components annotated with framework annotations- "@Controller(), @Injectable() " - ; eg: all controller classes in all modules are instantiated respectively. In that way we can build independent modules, expose REST APIs in separate controller classes. 

<p>
<img src="images/nestjs_modules_1.png"  alt="Wodo Platform" />
</p>

## Add a new NestJS Module

NestJS framework has a useful commnad line tool that we already installed. New modules and components can be added using command line commands. It helps to comply with project strcuture and best practicies. Let's add demouser module that will include user specific business logic such as login etc.

The nestjs commnad below generates and/or modifies files based on a schematic. 

```bash
nest g <schematic> <name> [options]
```

The commands need to be executed in the project root directory.

### Add DemoUser module
   
  ```bash
  nest g resource DemoUser
  ```
  The command creates src/demo-user/demo-user folder and adds all fundamental components such as modules, provider and controllers. Also the command updates root "app.module.ts" file with the new module definition.

### Add "api" path configuration for all controllers in demouser module
   
   Open "src/app.module.ts" file and register DemoModule in RouterModule module configuration for adding "api" to all REST API paths defined in demouser module. Add the codelines below.

   ```
   RouterModule.register([
      {
        path: 'api',
        module: DemoModule
      },
     {
        path: 'api',
        module: DemoUserModule
      }
    ])
   ```
### Add new DemoUser entity to prisma/schema.prisma file

   Add the following entity to schema.prisma file

   ```JSON
   model DemoUser {
      id            Int        @default(autoincrement()) @id
      name          String     @unique
      password      String
      deleted       Boolean
      createdAt     DateTime    @default(now())
      updatedAt     DateTime    @default(now())     
    }
   ```
  Change the "--name init" with something else such as "-name added_user_table"  in the package.json file and then run the following commands to complete DB migration. See [Generate Prisma artifacts](#generate-prisma-artifacts) section for further details
  
  ```bash
  npm run db:migrate
  npm run db:generate
  ```
  > Note: Your IDE might not see the generated prisma client codes. Hence run "npm i" and refresh the project in your IDE.

### Add DemoUserDto class
  
   NestJS framework generates most of the class for us. Still we need to create a general DemoUserDto class to expose daat via REST API. We should not return service or persistency objects used by underlying layers. The final exposed data is almost limited and should be separated. Add src/demo-user/dto/demo-user.dto.ts file with the content below

   ```TypeScript
    export class DemoUserDto {
      id: number;
      name: string;
      deleted: boolean;
      createdAt: Date;
      updatedAt: Date;

      constructor(id: number, name: string,  deleted: boolean, createdAt: Date, updatedAt: Date) {
          this.id = id;
          this.name = name;
          this.deleted = deleted;
          this.createdAt = createdAt;
          this.updatedAt = updatedAt;
      }
    }
   ```

### Bind persistency layer to service layer

  NestJS already provided service layer classes - src/demo-user/demo-user.service.ts -  for us.  You need to inject persistency layer classes - src/service/prisma.service.ts - to service layer now. First add "PrismaService" to the providers in src/demo-user/demo-user.module.ts then open demo-user.service.ts and add constructor as below. 
  
  ```TypeScript
     constructor(private prisma: PrismaService) {}
  ```
  NestJS injects a singleton instance of PrismaService automatically. Implement create method and make it async. You need to make controller methods a sync as well.

  ```TypeScript
   async create(createDemoUserDto: CreateDemoUserDto): Promise<DemoUserDto> 
  ```

  "create" method returns our new DemoUserDto object. You need to convert DemoUser object to DemoUserDto object in your implementation

## Validation & Error Codes

We foster a holistic approach for handling error cases in Wodo Platform. Our platform and solutions are sophisticated and comprised of different pieces. Therefore we reserve error code segments for each solution and component. Error codes are defined in consolidated "error.codes.ts" class of wg-shared-lib repository. We leverage this centrialized module to build our error code library across our environment and microservices. Error messages contains a unique error code and details. Extra fields can be added to error message depending on transport and technology. A sample REST API error message is show below. Additional "statusCode" field is added to imply http error code.

```JSON
{
    "statusCode": 400,
    "message": "Wodo Gaming general validation error.",
    "errorCode": "WG_49",
    "details": "property:, message:must have required property 'name'"
}
```

> WG_49 stands for "Wodo Gaming" error code 49.

The purpose of error code is to determine a unique number with an associated description so that when specific errors are thrown, they are aggregated in log files or returned to 3rd party API clients. Eventually it is much easier to understand root causes with specific error codes.

Follow the steps below in order to add error handling to your microservice or macroservice.

1. **Error code segment:** Determine an error code segment and add it to error.codes.ts class in wg-shared-lib module. 
2. **Release wg-shared=lib:** Increase version number in package.json file of wg-shared-lib and commit your change. Our CI/CD flow will release your version.
3. **Add wg-shared-lib dependency:** Update/add wg-shared-lib dependency "@wodo-platform/wg-shared-lib": "1.0.10", to dependencies section of package.json file in your microservice. 
4. **Add Interceptor:** Add src/common/errors.interceptor.ts  provider to provider list of src/app.module.ts file. When you throw errors, the interceptor prepares error details in standard format based on error codes.

```JSON
  {
    provide: APP_INTERCEPTOR,
    useClass: ErrorsInterceptor,
  }
```

### Validation Pipes

A pipe is a class annotated with the @Injectable() decorator, which implements the PipeTransform interface in NestJS framework.Pipes have two typical use cases:

- **transformation:** transform input data to the desired form (e.g., from string to integer)
- **validation:** evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception when the data is incorrect

In both cases, pipes operate on the arguments being processed by a controller route handler. Nest interposes a pipe just before a method is invoked, and the pipe receives the arguments destined for the method and operates on them. Pipes run inside the exceptions zone. This means that when a Pipe throws an exception it is handled by src/common/errors.interceptor.ts.  We use pipes in our controller classes to validate JSON payloads and to dotype conversions.

Nest comes with eight pipes available out-of-the-box.They're exported from the @nestjs/common package.

- ValidationPipe
- ParseIntPipe
- ParseFloatPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- ParseEnumPipe
- DefaultValuePipe

We leverage [Ajv](https://ajv.js.org/) package to define payload schemas for our DTO objects (JSON payloads). You can consider such schema objest as xsd files in XML parsing. The basic steps to add payload validation

1. Add DTO class and a corresponding schema valdiation class.
2. Define specific WG_X error codes in "error.codes.ts" class of wg-shared-lib repository as described in the previous section
3. Register validation schema class to Avj in src/common/pipes/validation.ts class
4. Add your error code handling logic to src/common/pipes/validation.pipe.ts class
5. Add your ValidationPipe definition to desired methods in REST API cotnroller classes

Let's go through sample create-demo-user.dto.ts payload validation.

DTO Class

```JSON
  export class CreateDemoUserDto {

      name: string;
      password: string;

      constructor(name: string, password: string) {
          this.name = name;
          this.password = password;
      }
  }
```     

AVJ Schema Definition Class src/demo-user/dto/create-demo-user.dto.schema.ts

```JSON
import {JSONSchemaType} from "ajv";
import { CreateDemoUserDto } from "./create-demo-user.dto";

export const createDemoUserValidationSchema:JSONSchemaType<CreateDemoUserDto> = {
    
    type: 'object', 
    // Type can be: number, integer, string, boolean, array, object or null. see https://ajv.js.org/json-schema.html
    properties: {
        name:      { type: "string", minLength : 1 }, 
        password:  { type: "string" }
    },
    required: ["name","password"],
    additionalProperties: false
};
```

AS you notices we added fields of CreateDemoUserDto to properties array with type definition and extra validation cases. Now register the schema in AVJ. Add the following lines to src/common/pipes/validation.ts

```TypeScript
export const VALIDATION_SCHEMA_DEMO_USER_CREATE = "validation.schema.demo.user.create";
ajv.addSchema(createDemoUserValidationSchema, VALIDATION_SCHEMA_DEMO_USER_CREATE);
```
Add your error handling logic to src/common/pipes/validation.pipe.ts

```TypeScript
else if(this.validationSchema && this.validationSchema === VALIDATION_SCHEMA_DEMO_USER_CREATE) {
  wgErrorCode = WG_ERROR_WG_VALIDATION; 
}
```

As final step, add your your ValidationPipe to your controller method in src/demo-user/demo-user.controller.ts

```TypeScript
@Post()
async create(@Body(new ValidationPipe(VALIDATION_SCHEMA_DEMO_USER_CREATE)) createDemoUserDto: CreateDemoUserDto) : Promise<DemoUserDto> {
  return await this.demoUserService.create(createDemoUserDto);
}
```

## Unit Tests & Integration Tests

To be updated

# Add wodo npm package dependencies

To be able to add internal wodo module as npm dependency, you need to authenticate to git remote npm package repository by logging in to npm, use the npm login command, replacing USERNAME with your GitHub username, TOKEN with your personal access token, and PUBLIC-EMAIL-ADDRESS with your email address.

If GitHub Packages is not your default package registry for using npm and you want to use the npm audit command, we recommend you use the --scope flag with the owner of the package when you authenticate to GitHub Packages.

```bash
$ npm login --scope=@wodo-platform --registry=https://npm.pkg.github.com 
```
Enter your git username, git token as password and your git email.

Once you login successfully, you can run "npm install" command and start to develop your features. 

## Github Actions

To run the same steps in the gitflow actions we need to create a secret in org level and set a personal access token as secret value so that when we run a repository, it can reach npn package regidtery of another private repository. GITHUB_TOKEN is generated by the gitflows per repository. It can not access to other private repos. We have WODO_TOKEN storing Serhat's personal access token as value today. TODO: It will be fixed later. 

If you need a token that requires permissions that aren't available in the GITHUB_TOKEN, you can create a personal access token and set it as a secret in your repository:

Use or create a token with the appropriate permissions for that repository. For more information, see "Creating a personal access token."
Add the token as a secret in your workflow's repository, and refer to it using the ${{ secrets.SECRET_NAME }} syntax. For more information, see "Creating and using encrypted secrets."

https://docs.github.com/en/actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow


# Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# build for production
$ npm run build

# production mode
$ npm run start:prod
```

Refer to "pacakge.json" file in project root to see further details about the commands

> please see the doc to understand runtime configurations and ".env" file config of nestjs framework: https://docs.nestjs.com/techniques/configuration

# Building docker image

Along with build and run functionality on your command line, we need to build docker images as well. It means we need to build your project from scratch while preparing docker images. You need to run "npm login" command during docker build process. In order to achive that we can generate .npmrc file in Dockerfile with ${NPM_TOKEN} argument. We will provide the token as argument NPM_TOKEN to the docker build process. 

In your repo root folder, run the following command with your own git token. It will build docker image and add it to your configured docker registery on your laptop

```bash
$ docker build -t wp-nodejs-demo-microservice --build-arg NPM_TOKEN=your_token . 
```

To run the nodejs app on your local laptop, you can run the wollowinf command

```bash
$ docker run -dp 8080:3000 wp-nodejs-demo-microservice
```

Open the url "http://localhost:8080/api/demos" and "http://localhost:8080/docs" in your browser to see API and swagger doc.

# Publish The Module as NPM Package Locally

You may need to publish npm packages from your local dev env in order to speed up development process. It is sort of workaround and you should do clean-up your published package versions since our official github actions will take care of package publishing eventually.

> please do not forget to add "@wodo-platform/"  to name of your module in package.json file in order to publish it to the github npm repo.

Please follow the steps below to publish wodo-nodejs-persistance npm package from your local development environment.

```bash
npm login --scope=@wodo-platform --registry=https://npm.pkg.github.com
```

in your terminal and you’ll be prompted to provide the following. Enter your github username, access token and wodo-platform email:

```bash
Username: YOUR_GITHUB_USERNAME
Password: YOUR_GITHUB_TOKEN
Email (this IS public): wodo-platform@users.noreply.github.com
```

Once you log in successfully, you will see the messafe below:

```bash
Logged in as your_git_user to scope @wodo-platform on https://npm.pkg.github.com/.
```
Publish the package:

```bash
npm publish
```

Verif that wodo-nodejs-demo-microservice package has been published successfully with the correct version you provided in package.json file. Go to the page below and make sure that your packge is listed on the  published artifact list

```
https://github.com/orgs/wodo-platform/packages
```

> You should increase version number when you need to re-publish a new package version.

Once the package is published, you can add it to the dependencies list in package.json file for other projects. In order to retrieve the dependency, you must run **"npm login --scope=@Ywodo-platform --registry=https://npm.pkg.github.com
"** command at least once in your command prompt.

```
"dependencies": {
        "@wodo-platform/wodo-nodejs-demo-microservice": "1.0.0",

  }
```

More details can be found on <a href="https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry"> this page </a>


# CI and Github Workflows

In order to build and package your repo through CI/CD, please have a a look at the file .github/workflows/pipeline.yml under the root project folder. It is preconfigured githubflow. Whenever you push a change onto the main branch, it is triggered. It will be improved to be able to package and release artifacts based on a release process later.

# Next Steps

Once you compose your new repo, you can create helm charts in wodo-helm-charts repo then conitinue with local deployment and official CI/CD gitops deployment. Please refer to Wodo Platform Local Dev Environment guide.