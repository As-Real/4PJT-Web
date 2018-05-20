# 4PJT-Web

## Présentation

Ce repository Git comprend la version web du projet.

Il inclut : l'interface et l'API

L'interface correspond à la partie visible du site web (la partie mobile est sur un autre repository)

L'API correspond aux services web (= le back, coté serveur). Elle consiste en un ensemble de fonctionnalités (ajout d'utulisateurs, edition de fichiers....) mis à disposition aux deux interfaces.

C'est une API Restful : Chaque appel aux fonctionnalités de l'API se fait via une URL. Par exemple, pour ajouter un utilisateur, il faut requêter l'url `/api/users/add`

L'interface web et l'interface mobile appellent l'API quand un traitement doit être fait sur la base de données


## Installation et Utilisation

4 étapes doivent être réalisées pour l'installation :

- Récupérer le projet GIT
- Installer Node
- Installer NPM
- Configurer la base de données MySQl

### Projet

Cette étape peut se faire en ligne de commande ou via un outil GIT en interface graphique (exemple : sourcetree)

Sur SourceTree : Fichier => Cloner/nouveau 

Dans 'Source' ou 'URL', rentrer l'url du projet Git Hub

Elle peut être accessible en cliquant sur "Clone or Download" au sein du projet dans Git Hub

### Node

Il faut installer Node. Node est le serveur web qui permet de faire tourner le projet web.

https://nodejs.org/en/

Pour vérifier s'il fonctionne, il est possible d'entret `node -v` dans une ligne de commande

### NPM

#### Présentation

NPM est un gestionnaire de librarires.

Il permet de gérer tout ce qui touche aux librairies du projet.

#### Installer

Pour l'installer, il faut cocher la checkbox correspondante lors de l'installation de node.

Pour vérifier s'il fonctionne, il est possible d'entret `npm -v` dans une ligne de commande

#### Installer les librairies

Sur ce projet, il sera gardé une trace de chaque librarie node dans le fichier `package.json` à la racine du projet.

Ce fichier comprend simplement la liste de toutes les libraires nécessaires pour faire tourner le projet.

A chaque récuperation du projet ou d'une modification sur le projet depuis Git, il fautdra lancer la commande `npm install` à la racine du projet. Cette commande installera automatiquement toutes les libraries node présentes dans pacakge.json


#### Note : ajouter une librairie

Pour ajouter une librarie node au projet, il faut lancer `npm install <package> --save` ou `<package>` est le nom de la librairie. 

Chaque librairie sera atuomatiquemznt installée dans le dossier node_modules à la racine; et sera ajoutée (grace à l'option --save) dans le  fichier package.json. 

Ces libraires dans node_modules ne doivent pas être poussées sur Git, seul doit l'être le fichier package.json

### MySql


#### Server

Il faut un serveur MysSql. A ce niveau on peut utiliser  MySql Server (classique).

L'outil Wamp pour windows inclut deja un serveur MySql, cela peut faire l'affaire.

Il est conseillé de mettre 127.0.0.1 en hôte et 3306 en port


#### Créer la connexion

Il faut ensuite créer une connection MySql pour la lier au projet

Le plus facile pour configurer la base est d'installer  mysql workbench (https://dev.mysql.com/downloads/workbench/)

C'est une interface graphique qui permet une configuration facile de MySql

Une fois installé, on peut créer une connexion MySql.

Il faut ensuite créer un schema. Il est conseillé de l'appeller "default".  Cela peut être fait en executant 

```
CREATE SCHEMA `default`;
```


#### Importer les tables

Enfin, il faut séléctionner ce schema et executer le script  `initdb.mysql` qui se trouve à la racine du projet.


(File => Run SQL Script )
Ce fichier va créer le modèle des tables nécessaires pour le fonctionnement de l'API. Il sera mis à a jour des que la base changera , et pourra être lancé à chaque récupération du projet depuis GitHub.


#### Configurer dans le projet

Une fois cette connexion créee, il faudra lancer MySql workbench avant de lancer le projet. 

Les informations doivent ensuite être renseignées dans le fichier `default.json` dans le dossier `/config` à la racine du projet

Exemple de configuration pour le fichier `default.json` : 

````
{
  "mysql" : {
    "host" : "127.0.0.1",
    "port" : "3306",
    "user" : "root",
    "password" : "root",
    "database" : "default"
  }
}
````

### Lancement

Une fois toute les conditions réunies, il suffit de lancer la commande 

```
node bin/www

```

La console devrait afficher "Connected!"

Il est possible de vérifier le fonctionnement en accédant au projet puis aux l'url 

`http://localhost:3000/users/list`

`http://localhost:3000/users/add`


### File hosting

Pour heberger et gerer les fichiers, il faut fournir un chemin à Node.

Dans un second temps, ce chemin renverra vers l'espace de stockage Cloud une fois sur le serveur

Il faut fournir un chemin dans le fichier default.json, sous la clé storage.path. Dans le cas d'un environnement de dev, choisissez un dossier local de votre PC.

Ce chein sera la raçine de tous les fichiers/dossiers stockés

N'oubliez pas de créer un dossier pour chaque utilisateur existant, le dossier doit avoir pour nom l'id de l'utilisateur. Ce sera le dossier privé de cet utilisateur

Exemple de configuration pour le fichier `default.json` : 

````
{
  "mysql" : {...}
  "storage": {
    "path": "E:/Cours/4PJT/Test",
    "types": { laisser par défaut } 
  }
}
````
