---
title: An introduction to Linux
date: 2024-11-20
---
> [!info] Disclaimer
> This post serves as a cheatsheet going along with the introduction session to Linux I gave to Polytechnique students ([[linux-slides.pdf|slides]]).
# SSH
The first time you try to connect to a computer, you'll be asked to check if a given certificate is correct. Type `y` or `yes` then press enter.

You may find the list of all `COMPUTER`s on the [wikix](https://wikix.polytechnique.org/Ordinateurs_des_salles_info).
```shell
ssh (-i path/private/key) {first}.{last}@{COMPUTER}.polytechnique.fr
```
## Using key
Generate key:
```shell
cd ~/.ssh/
ssh-keygen -t ed25519
cat my_key.pub
```
Upload public key on remote server:
```shell
cd ~/.ssh/
nano authorized_keys
```
## SCP 
```shell
scp my-local.file id@server:~/path/to/copy.file
```
# Commands
## Navigating file tree
```shell
ls (-alsh)
pwd
cd path/to
cd (~)
cd -
exit
```
## Managing files
```shell
mkdir (-p)
touch
mv
cp (-r)
rm (-rf)
cat
less
tar
zip
unzip
```
## Managing files permissions
![[permissions.png]]
```shell
ls -l
chown (-R) [user][:group] A
chmod (-R) [ugoa][+-=][rwx] A
```
Make a file executable for the owner user and then run it:
```shell
chmod u+x A
./A
```
## Text editor
```shell
nano
vim
```
## Package manager
Here, using `apt`: 
```shell
apt update
apt upgrade
apt install A
apt remove A
```
## Help
```shell
man command
command --help
command -h
```
## Piping and redirections
```shell
command > standard_output_file
command >> concatenated_file
command 2> error_file
command > output_file_standard_and_errors 2>&1
ls | grep my-file
```
## Tips
- `CTRL+C` to stop a program
- `command &` to start in the background
- `nohup command > output_file 2>&1` to start a program in the background without killing it when closing the SSH session
- `CTRL+Z`, `fg`, `bg`
- `/dev/null`
- `(h)top`
- `ps`
- `grep`
- `sed`
- `awk`
