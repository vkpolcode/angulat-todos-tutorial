<?php

/*
User item:
name,
password,
createdAt,
userRole: admin, user, guest
 */

function users_getAll()
{
    try {
        $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        $filters = [];
        if (isset($_GET['email']) && !empty($_GET['email'])) {
            $filters = [
                'email' => $_GET['email']
            ];
        }
        $query = new MongoDB\Driver\Query($filters);
        $res = $manager->executeQuery('todos.users', $query);
        $users = array();
        foreach ($res as $row) {
            $item = new stdClass();
            foreach ($row as $key => $value) {
                if ($key == '_id') {
                    $value = (string)$value;
                }
                if($key == 'password') {
                    continue;
                }
                $item->$key = $value;
            }
            $users[] = $item;
        }
        return $users;
    } catch (Throwable $e) {
        print_r("Throwable\n");
        print_r($e->getMessage() . "\n");
    } catch (Exception $e) {
        print_r("Exception\n");
        print_r($e->getMessage() . "\n");
    }
    die;
}

function users_getOne($id)
{
    try {
        $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        $filters = [
            '_id' => new MongoDB\BSON\ObjectID($id)
        ];
        $query = new MongoDB\Driver\Query($filters);
        $res = $manager->executeQuery('todos.users', $query);
        $users = array();
        foreach ($res as $row) {
            $item = new stdClass();
            foreach ($row as $key => $value) {
                if ($key == '_id') {
                    $value = (string)$value;
                }
                if($key == 'password') {
                    continue;
                }
                $item->$key = $value;
            }
            $users[] = $item;
        }
        return $users;
    } catch (Throwable $e) {
        print_r("Throwable\n");
        print_r($e->getMessage() . "\n");
    } catch (Exception $e) {
        print_r("Exception\n");
        print_r($e->getMessage() . "\n");
    }
    die;
}

function users_postItem()
{
    try {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data)) {
            print_r("Empty data for insert\n");
            die;
        }
        $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        $filters = [];
        if (isset($data['email']) && !empty($data['email'])) {
            $filters = [
                'email' => $data['email']
            ];
        }
        $query = new MongoDB\Driver\Query($filters);
        $res = $manager->executeQuery('todos.users', $query);
        $users = array();
        foreach ($res as $row) {
            $item = new stdClass();
            foreach ($row as $key => $value) {
                if ($key == '_id') {
                    $value = (string)$value;
                }
                $item->$key = $value;
            }
            $users[] = $item;
        }
        if(!empty($users)) {
            return [
                'result' => false,
                'message' => 'Account with same e-mail already exists.'
            ];
        }
        $newItem = [
            '_id' => new MongoDB\BSON\ObjectID(),
            'email' => $data['email'],
            'password' => $data['password'],
            'userRole' => 'user',
            'createAt' => date('Y-m-d H:i:s')
        ];

        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->insert($newItem);
        $manager->executeBulkWrite('todos.users', $bulk);
        return users_getOne((string)$newItem['_id']);
    } catch (Throwable $e) {
        print_r("Throwable\n");
        print_r($e->getMessage() . "\n");
    } catch (Exception $e) {
        print_r("Exception\n");
        print_r($e->getMessage() . "\n");
    }
    die;
}

function users_putItems($id)
{
    try {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data)) {
            return array('result' => 'Empty data for update');
        }
        $user = users_getOne($id);
        if (empty($user)) {
            return array('result' => 'Current Id is not correct');
        }
        $filter = ['_id' => new MongoDB\BSON\ObjectID($id)];
        $update = [];
        if (isset($data['email']) && !empty($data['email'])) {
            $update['email'] = $data['email'];
        } else {
            $update['email'] = $user->email;
        }
        if (isset($data['password']) && !empty($data['password'])) {
            $update['password'] = $data['password'];
        } else {
            $update['password'] = $user->password;
        }
        if (isset($data['userRole']) && !empty($data['userRole'])) {
            $update['userRole'] = $data['userRole'];
        } else {
            $update['userRole'] = $user->userRole;
        }
        if (isset($data['lastLogin']) && !empty($data['lastLogin'])) {
            $update['lastLogin'] = $data['lastLogin'];
        } else {
            $update['lastLogin'] = $user->lastLogin;
        }
        if (isset($data['createAt']) && !empty($data['createAt'])) {
            $update['createAt'] = $data['createAt'];
        } else {
            if(property_exists($user, 'createAt')) {
                $update['createAt'] = $user->createAt;
            } else {
                $update['createAt'] = date('Y-m-d H:i:s');
            }
        }
        $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->update($filter, $update);
        $manager->executeBulkWrite('todos.users', $bulk);
        return users_getOne($id);
    } catch (Throwable $e) {
        print_r("Throwable\n");
        print_r($e->getMessage() . "\n");
    } catch (Exception $e) {
        print_r("Exception\n");
        print_r($e->getMessage() . "\n");
    }
    die;
}

function users_deleteItems($id)
{
    try {
        $filter = ['_id' => new MongoDB\BSON\ObjectID($id)];
        $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->delete($filter);
        $manager->executeBulkWrite('todos.users', $bulk);
        return ['result' => true];
    } catch (Throwable $e) {
        print_r("Throwable\n");
        print_r($e->getMessage() . "\n");
    } catch (Exception $e) {
        print_r("Exception\n");
        print_r($e->getMessage() . "\n");
    }
    die;
}

$users = [];
switch (strtolower($_SERVER['REQUEST_METHOD'])) {
    case 'get':
        if (!empty($_GET) && isset($_GET['_id']) && !empty($_GET['_id'])) {
            $users = users_getOne($_GET['_id']);
        } else {
            $users = users_getAll();
        }
        break;
    case 'post':
        $users = users_postItem();
        break;
    case 'put':
        if (!empty($_GET) && isset($_GET['_id']) && !empty($_GET['_id'])) {
            $users = users_putItems($_GET['_id']);
        } else {
            print_r("User id can't be empty.\n");
            die;
        }
        break;
    case 'delete':
        if (!empty($_GET) && isset($_GET['_id']) && !empty($_GET['_id'])) {
            $users = users_deleteItems($_GET['_id']);
        } else {
            print_r("User id can't be empty.\n");
            die;
        }
        break;
}
header('HTTP/1.1 200 OK', true, 200);
header('Content-Type: application/json');
echo json_encode($users);
exit(0);