<?php

/*
User item:
email,
password,
createdAt,
userRole: admin, user, guest,
lastLogin
 */

function loginFunction()
{
    try {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data)) {
            return array('result' => 'Empty data for update');
        }
        $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        if (isset($data['username']) && !empty($data['username'])) {
            $filters = [
                'email' => $data['username']
            ];
        } else {
            return [
                'result' => false,
                'message' => "Email field can't be empty."
            ];
        }
        if (!isset($data['password']) || empty($data['password'])) {
            return [
                'result' => false,
                'message' => "Password field can't be empty."
            ];
        }
        $query = new MongoDB\Driver\Query($filters);
        $res = $manager->executeQuery('todos.users', $query);
        $users = array();
        $item = new stdClass();
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
        if (empty($users)) {
            return [
                'result' => false,
                'message' => 'Account not exist.'
            ];
        } else if (count($users) > 1) {
            return [
                'result' => false,
                'message' => 'There are too much accounts with same email.'
            ];
        } else if (count($users) == 1 && $item->password == $data['password']) {
            $filter = ['_id' => new MongoDB\BSON\ObjectID($item->_id)];
            $update = [
                'email' => $item->email,
                'password' => $item->password,
                'userRole' => $item->userRole,
                'createAt' => $item->createAt,
                'lastLogin' => date('Y-m-d H:i:s'),
            ];
            $bulk = new MongoDB\Driver\BulkWrite;
            $bulk->update($filter, $update);
            $manager->executeBulkWrite('todos.users', $bulk);
            return [
                'result' => true,
                'role' => $item->userRole,
                'id' => $item->_id
            ];
        } else {
            return [
                'result' => false,
                'message' => 'Password is not correct.'
            ];
        }
    } catch (Throwable $e) {
        print_r("Throwable\n");
        print_r($e->getMessage() . "\n");
    } catch (Exception $e) {
        print_r("Exception\n");
        print_r($e->getMessage() . "\n");
    }
    die;
}

$result = loginFunction();

header('HTTP/1.1 200 OK', true, 200);
header('Content-Type: application/json');
echo json_encode($result);
exit(0);