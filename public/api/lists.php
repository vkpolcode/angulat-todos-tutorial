<?php

/*
Lists item:

name,
userid,
createdAt
open
 */

function lists_getAll()
{
    try {
        $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        $filters = [];
        if (isset($_GET['userId']) && !empty($_GET['userId'])) {
            $filters = [
                'userId' => $_GET['userId']
            ];
        }
        $query = new MongoDB\Driver\Query($filters);
        $res = $manager->executeQuery('todos.lists', $query);
        $lists = array();
        foreach ($res as $k => $row) {
            $item = new stdClass();
            foreach ($row as $key => $value) {
                if ($key == '_id') {
                    $value = (string)$value;
                }
                $item->$key = $value;
            }
            $lists[] = $item;
        }
        return $lists;
    } catch (Throwable $e) {
        print_r("Throwable\n");
        print_r($e->getMessage() . "\n");
    } catch (Exception $e) {
        print_r("Exception\n");
        print_r($e->getMessage() . "\n");
    }
    die;
}

function lists_getOne($id)
{
    try {
        $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        $filters = [
            '_id' => new MongoDB\BSON\ObjectID($id)
        ];
        $query = new MongoDB\Driver\Query($filters);
        $res = $manager->executeQuery('todos.lists', $query);
        $lists = array();
        foreach ($res as $row) {
            $item = new stdClass();
            foreach ($row as $key => $value) {
                if ($key == '_id') {
                    $value = (string)$value;
                }
                $item->$key = $value;
            }
            $lists[] = $item;
        }
        return $lists;
    } catch (Throwable $e) {
        print_r("Throwable\n");
        print_r($e->getMessage() . "\n");
    } catch (Exception $e) {
        print_r("Exception\n");
        print_r($e->getMessage() . "\n");
    }
    die;
}

function lists_postItem()
{
    try {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data)) {
            print_r("Empty data for insert\n");
            die;
        }
        $newItem = [
            '_id' => new MongoDB\BSON\ObjectID(),
            'name' => $data['name'],
            'userId' => $data['userId'],
            'createAt' => date('Y-m-d H:i:s')
        ];
        $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->insert($newItem);
        $manager->executeBulkWrite('todos.lists', $bulk);
        return lists_getOne((string)$newItem['_id']);
    } catch (Throwable $e) {
        print_r("Throwable\n");
        print_r($e->getMessage() . "\n");
    } catch (Exception $e) {
        print_r("Exception\n");
        print_r($e->getMessage() . "\n");
    }
    die;
}

function lists_putItems($id)
{
    try {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data)) {
            print_r("Empty data for update\n");
            die;
        }
        $list = lists_getOne($id);
        if (empty($list)) {
            return array('result' => 'Current Id is not correct');
        }
        $filter = ['_id' => new MongoDB\BSON\ObjectID($id)];
        $update = [];
        if (isset($data['name']) && !empty($data['name'])) {
            $update['name'] = $data['name'];
        } else {
            $update['name'] = $list->name;
        }
        if (isset($data['userId']) && !empty($data['userId'])) {
            $update['userId'] = $data['userId'];
        } else {
            $update['userId'] = $list->userId;
        }
        if (isset($data['createAt']) && !empty($data['createAt'])) {
            $update['createAt'] = $data['createAt'];
        } else {
            if(property_exists($list, 'createAt')) {
                $update['createAt'] = $list->createAt;
            } else {
                $update['createAt'] = date('Y-m-d H:i:s');
            }
        }
        $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->update($filter, $update);
        $manager->executeBulkWrite('todos.lists', $bulk);
        return lists_getOne($id);
    } catch (Throwable $e) {
        print_r("Throwable\n");
        print_r($e->getMessage() . "\n");
    } catch (Exception $e) {
        print_r("Exception\n");
        print_r($e->getMessage() . "\n");
    }
    die;
}

function lists_deleteItems($id)
{
    try {
        $filter = ['_id' => new MongoDB\BSON\ObjectID($id)];
        $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->delete($filter);
        $manager->executeBulkWrite('todos.lists', $bulk);
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

$lists = [];

switch (strtolower($_SERVER['REQUEST_METHOD'])) {
    case 'get':
        if (!empty($_GET) && isset($_GET['_id']) && !empty($_GET['_id'])) {
            $lists = lists_getOne($_GET['_id']);
        } else {
            $lists = lists_getAll();
        }
        break;
    case 'post':
        $lists = lists_postItem();
        break;
    case 'put':
        if (!empty($_GET) && isset($_GET['_id']) && !empty($_GET['_id'])) {
            $lists = lists_putItems($_GET['_id']);
        } else {
            print_r("User id can't be empty.\n");
            die;
        }
        break;
    case 'delete':
        if (!empty($_GET) && isset($_GET['_id']) && !empty($_GET['_id'])) {
            $lists = lists_deleteItems($_GET['_id']);
        } else {
            print_r("User id can't be empty.\n");
            die;
        }
        break;
}
header('HTTP/1.1 200 OK', true, 200);
header('Content-Type: application/json');
echo json_encode($lists);
exit(0);