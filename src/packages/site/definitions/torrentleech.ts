import requests
from typing import List, Dict, Any
import time
import logging

logger = logging.getLogger(__name__)

class TorrentLeechAPI:
    def __init__(self, username: str, password: str):
        self.base_url = "https://www.torrentleech.org"
        self.session = requests.Session()
        self.username = username
        self.password = password
        self.user_id = None
        self.is_logged_in = False
        
        # 设置请求头以模拟浏览器行为
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
        })

    def login(self) -> bool:
        """登录到 TorrentLeech"""
        try:
            # 首先获取登录页面以获取必要的cookies和token
            login_page_url = f"{self.base_url}/user/account/login"
            response = self.session.get(login_page_url)
            response.raise_for_status()

            # 准备登录数据
            login_data = {
                'username': self.username,
                'password': self.password,
                'remember_me': 'on',
                'login': 'submit'
            }

            # 发送登录请求
            response = self.session.post(login_page_url, data=login_data, allow_redirects=True)
            response.raise_for_status()

            # 检查登录是否成功
            if any('auth' in cookie.name.lower() for cookie in self.session.cookies):
                self.is_logged_in = True
                logger.info("登录成功")
                
                # 获取用户ID
                self._get_user_id()
                return True
            else:
                logger.error("登录失败：未找到认证cookie")
                return False

        except Exception as e:
            logger.error(f"登录过程中出错: {e}")
            return False

    def _get_user_id(self) -> bool:
        """获取用户ID"""
        try:
            # 访问用户资料页面
            profile_url = f"{self.base_url}/user/profile"
            response = self.session.get(profile_url)
            response.raise_for_status()
            
            # 从响应中查找用户ID
            # 这里需要根据实际页面结构来解析用户ID
            # 暂时设置为None，在获取上传时使用其他方式
            self.user_id = None
            return True
            
        except Exception as e:
            logger.error(f"获取用户ID失败: {e}")
            return False

    def get_uploads(self, start: int = 0, length: int = 50) -> List[Dict[str, Any]]:
        """获取用户上传的种子列表
        
        Args:
            start: 起始位置
            length: 返回数量
            
        Returns:
            种子列表
        """
        if not self.is_logged_in:
            if not self.login():
                return []

        try:
            # 使用实际的API端点
            api_url = f"{self.base_url}/user/account/uploadedtorrents"
            
            # 准备请求数据
            data = {
                'sEcho': '1',
                'iColumns': '6',
                'sColumns': 'categoryID,name,size,completed,seeders,leechers',
                'iDisplayStart': str(start),
                'iDisplayLength': str(length),
                'mDataProp_0': '0',
                'sSearch_0': '',
                'bRegex_0': 'false',
                'bSearchable_0': 'true',
                'bSortable_0': 'false',
                'mDataProp_1': '1',
                'sSearch_1': '',
                'bRegex_1': 'false',
                'bSearchable_1': 'true',
                'bSortable_1': 'false',
                'mDataProp_2': '2',
                'sSearch_2': '',
                'bRegex_2': 'false',
                'bSearchable_2': 'true',
                'bSortable_2': 'true',
                'mDataProp_3': '3',
                'sSearch_3': '',
                'bRegex_3': 'false',
                'bSearchable_3': 'true',
                'bSortable_3': 'true',
                'mDataProp_4': '4',
                'sSearch_4': '',
                'bRegex_4': 'false',
                'bSearchable_4': 'true',
                'bSortable_4': 'true',
                'mDataProp_5': '5',
                'sSearch_5': '',
                'bRegex_5': 'false',
                'bSearchable_5': 'true',
                'bSortable_5': 'true',
                'sSearch': '',
                'bRegex': 'false',
                'iSortCol_0': '0',
                'sSortDir_0': 'asc',
                'iSortingCols': '1',
                'userID': '1713978'  # 这个需要动态获取
            }

            # 设置API请求的特定头信息
            headers = {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': self.base_url,
                'Referer': f'{self.base_url}/user/profile',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
            }

            # 发送请求
            response = self.session.post(api_url, data=data, headers=headers)
            response.raise_for_status()

            # 解析响应
            result = response.json()
            
            if result.get('aaData'):
                return self._parse_uploads_data(result['aaData'])
            else:
                logger.warning("没有找到上传数据")
                return []

        except Exception as e:
            logger.error(f"获取上传列表失败: {e}")
            return []

    def _parse_uploads_data(self, data: List[List]) -> List[Dict[str, Any]]:
        """解析上传数据
        
        Args:
            data: 原始数据列表
            
        Returns:
            解析后的种子列表
        """
        uploads = []
        
        for item in data:
            try:
                # 根据观察到的数据结构解析
                # 这里需要根据实际的HTML结构来调整
                upload = {
                    'category': item[0] if len(item) > 0 else '',
                    'name': item[1] if len(item) > 1 else '',
                    'size': item[2] if len(item) > 2 else '',
                    'completed': item[3] if len(item) > 3 else '',
                    'seeders': item[4] if len(item) > 4 else '',
                    'leechers': item[5] if len(item) > 5 else '',
                }
                uploads.append(upload)
            except Exception as e:
                logger.warning(f"解析种子数据失败: {e}")
                continue
                
        return uploads

    def get_all_uploads(self) -> List[Dict[str, Any]]:
        """获取所有上传的种子（分页获取）"""
        all_uploads = []
        start = 0
        page_size = 50
        
        while True:
            logger.info(f"获取上传种子，起始位置: {start}")
            uploads = self.get_uploads(start, page_size)
            
            if not uploads:
                break
                
            all_uploads.extend(uploads)
            
            # 如果返回的数量少于请求的数量，说明已经到达最后一页
            if len(uploads) < page_size:
                break
                
            start += page_size
            time.sleep(1)  # 避免请求过于频繁
            
        return all_uploads

    def close(self):
        """关闭会话"""
        self.session.close()


# 使用示例
def main():
    # 设置日志
    logging.basicConfig(level=logging.INFO)
    
    # 初始化API
    tl = TorrentLeechAPI("your_username", "your_password")
    
    try:
        # 登录
        if tl.login():
            print("登录成功！")
            
            # 获取上传的种子
            print("获取上传种子...")
            uploads = tl.get_all_uploads()
            
            print(f"共找到 {len(uploads)} 个上传种子:")
            for i, upload in enumerate(uploads, 1):
                print(f"{i}. {upload.get('name', 'N/A')} - 大小: {upload.get('size', 'N/A')} - 完成: {upload.get('completed', 'N/A')}")
        else:
            print("登录失败！")
            
    except Exception as e:
        print(f"发生错误: {e}")
    finally:
        tl.close()


if __name__ == "__main__":
    main()
