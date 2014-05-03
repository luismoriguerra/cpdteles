<?
class MySqlDocenteDAO{
	
	public function InsertarDocente($data){
	$db=creadorConexion::crear('MySql');
	$sql="";
	$db->setQuery($sql);
    $valsql=$db->loadObjectList();
		if(count($valsql)>0){
		return array('rst'=>'2','msj'=>"Docente:".$data['dapepat']." ".$data['dapemat'].", ".$data['dnombre']." existe");exit();
		}
		else{
		$sql="INSERT INTO profesm";	
		$db->iniciaTransaccion();
		$db->setQuery($sql);
			if(!$db->executeQuery()){
				$db->rollbackTransaccion();
				return array('rst'=>'3','msj'=>'Error al Registrar Datos'.$sql);exit();
			}
			else{
				if(!MySqlTransaccionDAO::insertarTransaccion($sql,$data['cfilialx']) ){
                $db->rollbackTransaccion();
                return array('rst'=>'3','msj'=>'Error al Registrar Datos','sql'=>$sql);exit();
                }
				$db->commitTransaccion();
				return array('rst'=>'1','msj'=>'Docente ingresada correctamente');exit();
			}
		}
	}
	
	public function ActualizarDocente($data){
	$db=creadorConexion::crear('MySql');
	$sql="";
	$db->setQuery($sql);
    $valsql=$db->loadObjectList();
		if(count($valsql)>0){
		return array('rst'=>'2','msj'=>"Docente:".$data['dapepat']." ".$data['dapemat'].", ".$data['dnombre']." existe");exit();
		}
		else{
		$sql="	UPDATE profesm SET
                fusuari=now(),
				ttiptra='M'
				WHERE cprofes='".$data['cprofes']."'";
		$db=creadorConexion::crear('MySql');
		$db->iniciaTransaccion();
		$db->setQuery($sql);
			if(!$db->executeQuery()){
				$db->rollbackTransaccion();
				return array('rst'=>'3','msj'=>'Error al Registrar Datos');exit();
			}
			else{
				if(!MySqlTransaccionDAO::insertarTransaccion($sql,$data['cfilialx']) ){
                $db->rollbackTransaccion();
                return array('rst'=>'3','msj'=>'Error al Registrar Datos','sql'=>$sql);exit();
                }
				$db->commitTransaccion();
				return array('rst'=>'1','msj'=>'Docente actualizado correctamente');exit();
			}
		}
	}
	
	public function JQGridCountDocente($where){
		$db=creadorConexion::crear('MySql');
		$sql="  SELECT count(p.cprofes) as count
                FROM profesm p
                INNER JOIN personm pe ON (pe.`cperson`=p.`cperson`)
			    WHERE 1=1 $where";
		$db->setQuery($sql);
		$data=$db->loadObjectList();
		if( count($data)>0 ){
            return $data;
        }else{
            return array(array('COUNT'=>0));
        }
	}
	
	public function JQGRIDRowsDocente( $sidx, $sord, $start, $limit, $where) {
	$sql="	SELECT p.`cprofes`,pe.`dappape`,pe.`dapmape`,pe.`dnomper`,pe.`ndniper`,p.`fingreso`
            FROM profesm p
            INNER JOIN personm pe ON (pe.`cperson`=p.`cperson`)
            WHERE 1=1 $where
            ORDER BY $sidx $sord
            LIMIT $start , $limit ";
        $db=creadorConexion::crear('MySql');
        $db->setQuery($sql);
        $data=$db->loadObjectList();        
        return $data;
    }    
}
?>